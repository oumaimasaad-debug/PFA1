from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from gradio_client import Client, handle_file
import os
import zipfile
import shutil
import time
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# 📁 Configuration des chemins
BASE_DIR = r"C:\Users\omaim\Desktop\back\templates"
DATASET_DIR = os.path.join(BASE_DIR, "uploaded_dataset")
OUTPUT_DIR = os.path.join(BASE_DIR, "img2img_output")
ZIP_PATH = os.path.join(BASE_DIR, "img2img_result.zip")

# 🔗 Client Gradio
client = Client("https://237806583a72bb7deb.gradio.live/")

# 🧼 Sécurisation des noms
def clean_filename(name):
    return "".join(c if c.isalnum() or c in "_-" else "_" for c in name)

# 🧠 Génération d'image via Gradio
def generate_image_from_input(class_name, prompt, image_path, image_id):
    try:
        print(f">>> Génération pour classe: {class_name}, prompt: {prompt}, image: {image_path}")

        result_path = client.predict(
            image_input=handle_file(image_path),
            prompt=prompt,
            steps=1,
            sampler_name="euler",
            scheduler="simple",
            sigma_value=0.35,
            seed=0,
            api_name="/predict"
        )

        # ⏳ Attente active jusqu'à la génération de l'image
        wait_time = 0
        while (not os.path.exists(result_path) or os.path.getsize(result_path) == 0) and wait_time < 30:
            time.sleep(0.5)
            wait_time += 0.5

        if not os.path.exists(result_path) or os.path.getsize(result_path) == 0:
            raise Exception("Image non générée correctement")

        class_folder = os.path.join(OUTPUT_DIR, clean_filename(class_name))
        os.makedirs(class_folder, exist_ok=True)

        filename = f"{image_id}.png"
        final_path = os.path.join(class_folder, filename)
        shutil.copy(result_path, final_path)

        return {"success": True, "path": final_path}
    except Exception as e:
        print(f"❌ Erreur génération : {e}")
        return {"success": False, "message": str(e)}

# 📥 Endpoint principal
@app.route('/img2img', methods=['POST'])
def img2img():
    uploaded_zip = request.files.get("dataset")
    prompt_data = request.form.get("prompt")

    if not uploaded_zip or not prompt_data:
        return jsonify({"success": False, "message": "Missing dataset or prompt"}), 400

    # 🧹 Nettoyage
    shutil.rmtree(DATASET_DIR, ignore_errors=True)
    os.makedirs(DATASET_DIR, exist_ok=True)

    shutil.rmtree(OUTPUT_DIR, ignore_errors=True)
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 📦 Extraction du ZIP
    zip_path = os.path.join(BASE_DIR, secure_filename(uploaded_zip.filename))
    uploaded_zip.save(zip_path)
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(DATASET_DIR)
    os.remove(zip_path)

    # 📋 Parsing des prompts
    class_prompts = [c.strip() for c in prompt_data.strip().split("END") if "/" in c]
    image_id = 1000
    results = []

    for class_prompt in class_prompts:
        parts = [p.strip() for p in class_prompt.split("/") if p.strip()]
        if not parts:
            continue
        class_name = parts[0]
        prompts = parts[1:]

        class_path = os.path.join(DATASET_DIR, "dataset", class_name)
        if not os.path.exists(class_path):
            print(f"⚠️ Classe {class_name} non trouvée dans le dataset.")
            continue

        for img_file in os.listdir(class_path):
            img_path = os.path.join(class_path, img_file)
            for p in prompts:
                res = generate_image_from_input(class_name, p, img_path, image_id)
                results.append(res)
                image_id += 1

    # ✅ Vérification finale : au moins une image générée ?
    all_images = []
    for root, _, files in os.walk(OUTPUT_DIR):
        for file in files:
            if file.endswith(".png"):
                all_images.append(os.path.join(root, file))

    if not all_images:
        return jsonify({"success": False, "message": "Aucune image générée"}), 500

    # 📦 Création du ZIP
    with zipfile.ZipFile(ZIP_PATH, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(OUTPUT_DIR):
            for file in files:
                abs_path = os.path.join(root, file)
                zipf.write(abs_path, os.path.relpath(abs_path, OUTPUT_DIR))

    # 📤 Envoi du ZIP
    return send_file(ZIP_PATH, as_attachment=True, download_name="img2img_result.zip")

# 🚀 Lancement
if __name__ == '__main__':
    app.run(debug=True, port=5000, use_reloader=False)
