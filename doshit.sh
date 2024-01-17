#!/bin/sh
cd ./contest
g++ a.cpp
./a.out < input.txt > output.txt
# compare the file with the expected_output file then put the result in verdict file
rm compare.txt
rm verdict.txt
diff output.txt expected_output.txt >> compare.txt
# cat compare.txt
if [[ -s compare.txt ]]; then
    echo "WA" >> verdict.txt
else
    echo "AC" >> verdict.txt
fi
echo done