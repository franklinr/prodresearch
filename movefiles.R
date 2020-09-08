refdir = "works4"
#setwd(paste("~/Local/Rref/",refdir,sep=""))
require(bib2df)
require(stringr)

setwd(refdir)
lines = readLines(paste(refdir,".bib",sep=""))

bibdf = bib2df(paste(refdir,".bib",sep=""))
bibdf$EXTRA = ""
for (i in 1:length(bibdf$FILE)){
  frow = bibdf$FILE[i]
  authors = str_split_fixed(bibdf$AUTHOR[[i]],",",2)[,1]
  year =  bibdf$YEAR[i]
#  print(i)
  ff = str_split(frow,";")[[1]]
  for (f in ff){
    if (!is.na(f) && str_detect(f,".pdf$")){
      print(f)
      authors = str_replace_all(authors,"[}]","")
      newfile = authors[1]
      if (length(authors) > 4){
        newfile = paste(newfile,"_etal",sep="")
      }else{
        if (length(authors) > 1)
          newfile = paste(newfile,authors[2],sep="_")
        if (length(authors) > 2)
          newfile = paste(newfile,authors[3],sep="_")
        if (length(authors) > 3)
          newfile = paste(newfile,authors[4],sep="_")
      }
      newfile = paste(newfile,year,".pdf",sep="")
      print(newfile)
      file.copy(f,paste("../refpdfs/",newfile,sep=""))
      
      bkey = bibdf$BIBTEXKEY[i]
      refstart = which(str_detect(lines,bkey))
      print(paste(bkey,"->",lines[refstart]))
      fileline = refstart+1
      while(!str_detect(lines[fileline]," file = ")){
        fileline = fileline + 1
      }
      
      if (str_detect(lines[refstart],bkey) && fileline < refstart+20){
        newfilelink = paste("https://github.com/franklinr/prodresearch/raw/master/refpdfs/",newfile,sep="")
        
        lines[fileline] = paste("  url = {",newfilelink,"},",sep="")
        print(lines[fileline])
      }
    }
  }
}
#https://github.com/franklinr/prodresearch/raw/master/refpdfs/Abbot-Smith_etal2017.pdf

writeLines(lines,paste(refdir,"b.bib",sep=""))


