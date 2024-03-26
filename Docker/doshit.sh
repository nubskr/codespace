#!/bin/sh
cd ./contest

rm compare.txt
rm verdict.txt

g++ -o a.out a.cpp


if [ $? -eq 0 ]; then
    # Run the program with timeout
    timeout 2s ./a.out < input.txt > output.txt

    # Check the exit status of the program
    if [ $? -eq 124 ]; then
        echo "Program took too long to execute. Terminating."
        echo "Time Limit Exceeded" >> verdict.txt
    else
        # executed successfully
        diff output.txt expected_output.txt >> compare.txt
        if [[ -s compare.txt ]]; then
            echo "Wrong Answer" >> verdict.txt
        else
            echo "Accepted" >> verdict.txt
        fi
    fi
else
    echo "Compilation Error" >> verdict.txt
fi

echo done