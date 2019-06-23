import cx_Freeze
import os.path


PYTHON_INSTALL_DIR = os.path.dirname(os.path.dirname(os.__file__))
os.environ['TCL_LIBRARY'] = os.path.join(PYTHON_INSTALL_DIR, 'tcl', 'tcl8.6')
os.environ['TK_LIBRARY'] = os.path.join(PYTHON_INSTALL_DIR, 'tcl', 'tk8.6')
executables = [cx_Freeze.Executable('chess.py')]

cx_Freeze.setup(
    name='Chess',
    options={'build_exe': {
        'packages':['pygame', 'sys', 'random', 'pymsgbox'],
        'include_files':[os.path.join(PYTHON_INSTALL_DIR, 'DLLs', 'tk86t.dll'),
            os.path.join(PYTHON_INSTALL_DIR, 'DLLs', 'tcl86t.dll'), 'Pb.png', 'Pw.png', 'Rb.png', 'Rw.png', 'Nb.png', 'Nw.png', 'Bb.png', 'Bw.png', 'Qb.png', 'Qw.png', 'Kb.png', 'Kw.png']
    }},
    executables=executables
)
