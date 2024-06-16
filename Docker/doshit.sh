#!/bin/sh

# TODO: In case the container force closes due to any reason, the user changes and the files are unaccessible

verdict_path="./contest/verdict.txt"
output_path="./sandbox/output.txt"
compare_path="./contest/compare.txt"
expected_output_path="./contest/expected_output.txt"

truncate -s 0 $verdict_path $compare_path

mkdir sandbox
cp ./contest/a.cpp ./sandbox/a.cpp
cp ./contest/input.txt ./sandbox/input.txt

# we do a little trolling
SECRET_PASS=$(tr -dc '[:alnum:]' < /dev/urandom | head -c 69)

echo "root:$SECRET_PASS" | chpasswd

chown root ./contest
chmod 700 -R ./contest

# make a good boi
adduser -D -h ./sandbox sandbox_boi

# we can just compile here, no harm in doing that
g++ -o ./sandbox/a.out ./sandbox/a.cpp
stat=$?
chown -R sandbox_boi:sandbox_boi ./sandbox
chmod 700 -R ./sandbox

if [ $stat -eq 1 ]; then
    echo "Compilation Error" >> $verdict_path
    echo "compilation error bruh"sss
    chown -R sandbox_boi:sandbox_boi ./contest
    exit 1
fi

# reset for safety ?
SECRET_PASS=$(tr -dc '[:alnum:]' < /dev/urandom | head -c 69)

(
    # new shell instance
    timeout 2s su - sandbox_boi -c "./a.out < input.txt > output.txt"
)


exit_status=$?

chown -R sandbox_boi:sandbox_boi ./contest
cp ./sandbox/output.txt ./contest/output.txt

if [ $exit_status -eq 124 ]; then
    echo "Time Limit Exceeded" >> $verdict_path

elif [ $exit_status -ne 0 ]; then
    echo "Runtime Error" >> $verdict_path

else
    # removed the output.txt ? heh, not so fast
    if [ ! -f $output_path ]; then
        touch $output_path
    fi

    diff --brief $output_path $expected_output_path > $compare_path
    cat $compare_path
    
    if [ -s $compare_path ]; then
        echo "Wrong Answer" >> $verdict_path
    else
        echo "Accepted" >> $verdict_path
    fi
fi