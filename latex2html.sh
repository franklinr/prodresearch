Rscript movefiles.R 

latex -interaction=nonstopmode main
bibtex main
htlatex main
perl -0777 -pe 's/,\s+[&][#]8212;[&][#]8212;-/ &nbsp;&nbsp;&nbsp;&nbsp/g' main.html > main2.html

rm main.[^ht]* main.tmp 
git add .
git commit -m "Add existing file"
git push origin
