rm compare.txt
rm verdict.txt
diff output.txt expected_output.txt >> compare.txt
#cat compare.txt
if [[ -s compare.txt ]]; then
    echo "WA" >> verdict.txt # This line might be misleading, see below.
else
    echo "AC" >> verdict.txt
fi

cat verdict.txt

