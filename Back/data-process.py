import streamlit as st
import zipfile
import os
import shutil
import json
import requests
from PIL import Image
from gradio_client import Client, handle_file
from io import BytesIO


def extract_zip(zip_file, extract_to="dataset"):
    with zipfile.ZipFile(zip_file, 'r') as zip_ref:
        zip_contents = zip_ref.namelist()
        dataset_dir = [f for f in zip_contents if f.startswith("dataset/")]
        if dataset_dir:
            zip_ref.extractall(extract_to)
        else:
            st.error(" Le dossier 'dataset' est introuvable dans l'archive ZIP.")

def get_classes(dataset_path):
    dataset_dir = os.path.join(dataset_path, "dataset")
    if os.path.exists(dataset_dir):
        return [d for d in os.listdir(dataset_dir) if os.path.isdir(os.path.join(dataset_dir, d))]
    return []

def get_images_from_class(class_path):
    return [f for f in os.listdir(class_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

def parse_deepseek_output(output):
    prompts_by_class = {}
    lines = output.strip().splitlines()
    for line in lines:
        if "/" in line:
            parts = line.split("/")
            class_name = parts[0].strip().lower()
            prompts = [p.strip() for p in parts[1:-1] if p.strip().lower() != "end"]
            prompts_by_class[class_name] = prompts
    return prompts_by_class

def zip_directory(folder_path, zip_file_path):
    with zipfile.ZipFile(zip_file_path, 'w') as zipf:
        for root, _, files in os.walk(folder_path):
            for file in files:
                file_path = os.path.join(root, file)
                zipf.write(file_path, os.path.relpath(file_path, folder_path))

# --- Streamlit UI ---

st.set_page_config(page_title="Explorateur de Dataset", layout="wide")
st.title("🔍 Explorateur de Dataset")

uploaded_file = st.file_uploader("📤 Uploadez votre fichier .zip contenant un dossier 'dataset' avec des images organisées par classe", type="zip")

if uploaded_file is not None:
    extract_dir = "dataset"

    if os.path.exists(extract_dir):
        try:
            shutil.rmtree(extract_dir)
        except Exception as e:
            st.error(f"❌ Erreur pendant le nettoyage : {e}")
    os.makedirs(extract_dir, exist_ok=True)

    zip_path = os.path.join(extract_dir, "uploaded.zip")
    with open(zip_path, "wb") as f:
        f.write(uploaded_file.getbuffer())

    extract_zip(zip_path, extract_dir)
    st.success("✅ Dataset extrait avec succès !")

    classes = get_classes(extract_dir)

    if classes:
        st.subheader("📂 Aperçu des classes")
        nb_images_to_generate = {}

        for class_name in classes:
            class_path = os.path.join(extract_dir, "dataset", class_name)
            image_files = get_images_from_class(class_path)

            col1, col2, col3 = st.columns([3, 2, 3])
            with col1:
                st.markdown(f"**Classe :** `{class_name}`")
            with col2:
                st.markdown(f"**Images :** `{len(image_files)}`")
            with col3:
                nb = st.number_input(
                    f"Nombre d'images à générer pour '{class_name}'",
                    min_value=0,
                    max_value=1000,
                    value=0,
                    step=1,
                    key=class_name
                )
                nb_images_to_generate[class_name] = nb

        st.write("🔧 Vous avez défini :")
        st.json(nb_images_to_generate)

        if st.button("🚀 Envoyer le prompt à DeepSeek"):
            prompt_lines = ["Voici les classes et le nombre d'images à générer :"]
            for cls, nb in nb_images_to_generate.items():
                if nb > 0:
                    prompt_lines.append(f"- {nb} images de la classe : {cls}")
            full_prompt = "\n".join(prompt_lines)

            st.markdown("### 📤 Prompt envoyé :")
            st.code(full_prompt)

            headers = {
                "Authorization": f"Bearer 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",
                "Content-Type": "application/json",
            }

            payload = {
                "model": "anthropic/claude-3-haiku",
                "messages": [
                    {
                        "role": "user",
                        "content": "the user will give you a description of the dataset he wants to generate including the classes and the number of images he wants in every class and also informations that will guide you , what i want you to do is to generate prompts to give them to the model text to image to generate the images , i want you to respond this way , the name of the class in capital letter after that backslash / after that the prompts in small letter of the class separated with commas and after every prompt backslash / even if its the last(the number of prompts must be the number of images in every class), the comme then END after the end of prompts of every class,don't forget the backslash / even after END, the prompts must be well detailled and high resolution:" + full_prompt
                    }
                ]
            }

            with st.spinner("⏳ Envoi en cours..."):
                try:
                    response = requests.post(
                        url="https://openrouter.ai/api/v1/chat/completions",
                        headers=headers,
                        data=json.dumps(payload)
                    )
                    if response.status_code == 200:
                        reply = response.json()["choices"][0]["message"]["content"]
                        st.success("✅ Réponse de DeepSeek :")
                        st.markdown(reply)

                        prompts_by_class = parse_deepseek_output(reply)
                        client = Client("https://85f4042c7d5bebf740.gradio.live")

                        st.markdown("## 🎨 Génération des images via Gradio")

                        generated_dir = "generated"
                        os.makedirs(generated_dir, exist_ok=True)

                        for class_name, prompts in prompts_by_class.items():
                            class_path = os.path.join(extract_dir, "dataset", class_name)
                            image_files = get_images_from_class(class_path)

                            if not image_files:
                                st.warning(f"⚠️ Pas d'images pour la classe {class_name}")
                                continue

                            ref_image = os.path.join(class_path, image_files[0])
                            save_dir = os.path.join(generated_dir, class_name)
                            os.makedirs(save_dir, exist_ok=True)

                            for i, prompt in enumerate(prompts):
                                try:
                                    result = client.predict(
                                        image_input=handle_file(ref_image),
                                        prompt=prompt,
                                        steps=30,
                                        sampler_name="euler",
                                        scheduler="simple",
                                        sigma_value=0.35,
                                        seed=0,
                                        api_name="/predict"
                                    )

                                    image_output_path = os.path.join(save_dir, f"{class_name}_{i+1}.png")
                                    with open(image_output_path, "wb") as img_file:
                                        img_file.write(requests.get(result).content)

                                    st.image(result, caption=f"{class_name} - {prompt}", use_column_width=True)
                                except Exception as e:
                                    st.error(f"❌ Erreur génération image : {e}")

                        zip_output_path = "generated_images.zip"
                        zip_directory(generated_dir, zip_output_path)

                        with open(zip_output_path, "rb") as f:
                            st.download_button(
                                label="📥 Télécharger toutes les images générées (ZIP)",
                                data=f,
                                file_name="generated_images.zip",
                                mime="application/zip"
                            )
                    else:
                        st.error(f"❌ Erreur API : {response.status_code} - {response.text}")
                except Exception as e:
                    st.error(f"❌ Exception lors de l'appel API : {e}")
    else:
        st.error("❌ Aucune classe détectée dans le dossier 'dataset'.")
else:
    st.info("💡 Uploadez un fichier ZIP contenant un dossier 'dataset' avec des sous-dossiers d’images (1 dossier = 1 classe).")
