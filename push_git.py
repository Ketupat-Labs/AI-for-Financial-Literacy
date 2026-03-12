import subprocess

print("Getting status...")
status = subprocess.run(['git', 'status'], capture_output=True, text=True)
print("STATUS OUT:\n", status.stdout)

print("Add all...")
subprocess.run(['git', 'add', '.'], capture_output=True, text=True)

print("Committing...")
subprocess.run(['git', 'commit', '-m', 'Fix merge conflicts or new files'], capture_output=True, text=True)

print("Pulling...")
pull = subprocess.run(['git', 'pull', 'origin', 'main', '--allow-unrelated-histories', '--no-edit'], capture_output=True, text=True)
print("PULL OUT:\n", pull.stdout)
print("PULL ERR:\n", pull.stderr)

print("Pushing...")
push = subprocess.run(['git', 'push', '-u', 'origin', 'main'], capture_output=True, text=True)
print("PUSH OUT:\n", push.stdout)
print("PUSH ERR:\n", push.stderr)
