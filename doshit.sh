#!/bin/sh
cd ./contest
g++ a.cpp
./a.out < input.txt > output.txt
echo done