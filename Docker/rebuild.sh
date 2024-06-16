docker rm -f $(docker ps -aq)
docker rmi -f $(docker images -aq)

docker build -t nubskr/compiler:1 .
docker run -v '/home/nubskr/projects/codespace/server/routes/test1/:/contest' nubskr/compiler:1 
