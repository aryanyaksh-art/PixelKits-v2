# Import this before editing files from Python on Windows: forces UTF-8 and keeps LF line endings.
# Usage: import sys; sys.path.insert(0, "tools"); import pyedit
import builtins, io
_open = builtins.open
def uopen(p, mode='r', *a, **k):
    if 'b' not in mode:
        k.setdefault('encoding', 'utf-8'); k.setdefault('newline', '')
    return _open(p, mode, *a, **k)
builtins.open = uopen
