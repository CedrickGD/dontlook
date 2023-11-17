import json 

def handle_json(path, existing_data):
    with open(path, "w") as file:
        json.dump({"data": existing_data}, file)
        
