# FROM frolvlad/alpine-gxx:latest
FROM alpine:latest
RUN apk add --no-cache g++

COPY ./doshit.sh ./
RUN chmod +x doshit.sh

CMD ["./doshit.sh"]