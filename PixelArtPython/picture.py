from PIL import Image
import sys

s = "[\n"
for i in range(1,45):
    im = Image.open("cat (" + str(i) + ").jpg", "r")
    vals = ["".join([str(a // 28) for a in list(x)]) for x in list(im.getdata())]
    s += "\t[\n"
    for j in range(208):
        s += "\t\t["
        for k in range(250):
            s += vals[j * 250 + k] + ","
        s += "],\n"
    s += "\t],\n"
s += "]"

f = open("out.txt", "w")
f.write(s)