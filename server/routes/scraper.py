from bs4 import BeautifulSoup
import requests
import json
import sys

url = 'https://codeforces.com/contest/1826/problem/A'

param = sys.argv[1]

response = requests.get(url)

# setup the parser for html
soup = BeautifulSoup(response.text, 'html.parser')

# everything that matters is in this class
problem_statements = soup.find_all(class_='problem-statement')

for statement in problem_statements:
    # title
    title = statement.find(class_='title').text.strip()
    
    # time limit
    time_limit = statement.find(class_='time-limit').text.strip().replace('time limit per test', '')
    
    # memory limit
    memory_limit = statement.find(class_='memory-limit').text.strip().replace('memory limit per test', '')
    
    # input format
    input_spec = statement.find(class_='input-specification').text.strip().replace('Input', '')
    print("Input Specification:", input_spec)
    
    # output format
    output_spec = statement.find(class_='output-specification').text.strip().replace('Output', '')
    print("Output Specification:", output_spec)
    
    # sample inputs
    examples = statement.find(class_='sample-tests')
    input_tests = examples.find_all(class_='test-example-line')

    inputs = ""
    for i in input_tests: 
        input_example_lines = i.text.strip()
        inputs += input_example_lines
        inputs += '\n'
    
    # sample outputs
    output_tests = examples.find_all(class_='output')    
    outputs = ""

    # print(output_tests.text.strip())
    for i in output_tests:  
        output_example_lines = i.text.strip()
        outputs += output_example_lines
        outputs += '\n'
    
    note = statement.find(class_='note')
    notes = ""

    if note:
        note_text = note.text.strip().replace('Note', '')
        notes += note_text
        # print("Note:", note_text)
    
    data = {
        "title": title,
        "time limit": time_limit,
        "memory limit": memory_limit,
        "input format": input_spec,
        "output format": output_spec,
        "sample input": inputs,
        "sample outputs": outputs,
        "note": note_text
    }

    json_data = json.dumps(data, indent=4)
    print(json_data)
