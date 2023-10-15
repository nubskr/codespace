FROM frolvlad/alpine-gxx:latest
COPY ./doshit.sh ./
RUN chmod +x doshit.sh
CMD ["./doshit.sh"]