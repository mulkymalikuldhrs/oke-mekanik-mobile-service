import subprocess
import time
import requests

def run_test():
    print("Starting backend...")
    backend = subprocess.Popen(["node", "server/index.js"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    time.sleep(3)

    try:
        r = requests.get("http://localhost:3001/api/health")
        print(f"Health check: {r.status_code} {r.json()}")

        r = requests.post("http://localhost:3001/api/ai/diagnose", json={"problem": "mesin mogok dan asap hitam"})
        print(f"AI Diagnose check: {r.status_code} {r.json()}")

        if r.status_code == 200 and r.json().get('suggestion') == 'Tune Up':
            print("✅ ALL TESTS PASSED")
        else:
            print("❌ TESTS FAILED")

    finally:
        backend.terminate()

if __name__ == "__main__":
    run_test()
