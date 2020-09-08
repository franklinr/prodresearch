latex -interaction=nonstopmode main
bibtex main
htlatex main
perl -0777 -pe 's/,\s+[&][#]8212;[&][#]8212;-/ &nbsp;&nbsp;&nbsp;&nbsp/g' main.html > main2.html

