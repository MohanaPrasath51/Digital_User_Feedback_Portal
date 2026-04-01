import json
import os

# Paths to the relevant files
service_account_path = r'c:\Users\smuru\Downloads\feedback-portal\backend\serviceAccountKey.json'
env_path = r'c:\Users\smuru\Downloads\feedback-portal\backend\.env'

if os.path.exists(service_account_path) and os.path.exists(env_path):
    # 1. Load the clean json key
    with open(service_account_path, 'r', encoding='utf-8') as f:
        sa_data = json.load(f)
    
    # 2. Extract clean values
    clean_project_id = sa_data['project_id']
    clean_client_email = sa_data['client_email']
    # Escape newlines for .env
    clean_private_key = sa_data['private_key'].replace('\n', '\\n')

    # 3. Read the current .env
    with open(env_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # 4. Update the variables
    new_lines = []
    
    # Track which ones we've updated to avoid duplicates
    updated = set()

    for line in lines:
        if line.startswith('FIREBASE_PROJECT_ID='):
            new_lines.append(f'FIREBASE_PROJECT_ID={clean_project_id}\n')
            updated.add('FIREBASE_PROJECT_ID')
        elif line.startswith('FIREBASE_CLIENT_EMAIL='):
            new_lines.append(f'FIREBASE_CLIENT_EMAIL={clean_client_email}\n')
            updated.add('FIREBASE_CLIENT_EMAIL')
        elif line.startswith('FIREBASE_PRIVATE_KEY='):
            # Ensure it is quoted correctly
            new_lines.append(f'FIREBASE_PRIVATE_KEY="{clean_private_key}"\n')
            updated.add('FIREBASE_PRIVATE_KEY')
        elif line.startswith('MONGO_URI='):
            # Ensure MONGO_URI is clean
            clean_mongo = line.split('?', 1)[0]
            if clean_mongo.endswith('v2'):
                 new_lines.append(f'{clean_mongo}\n')
            else:
                 new_lines.append(line)
        else:
            new_lines.append(line)
    
    # Add any missing ones
    if 'FIREBASE_PROJECT_ID' not in updated:
        new_lines.append(f'FIREBASE_PROJECT_ID={clean_project_id}\n')
    if 'FIREBASE_CLIENT_EMAIL' not in updated:
        new_lines.append(f'FIREBASE_CLIENT_EMAIL={clean_client_email}\n')
    if 'FIREBASE_PRIVATE_KEY' not in updated:
        new_lines.append(f'FIREBASE_PRIVATE_KEY="{clean_private_key}"\n')

    # 5. Save the updated .env
    with open(env_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("SUCCESS: .env has been cleaned and secured for deployment.")
else:
    print("ERROR: Could not find required files.")
