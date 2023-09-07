FROM alpine:3.16

WORKDIR /quartz

RUN apk add --no-cache go hugo git make perl
RUN git config --global --add safe.directory '/quartz'
RUN go install github.com/jackyzha0/hugo-obsidian@latest
ENV PATH="/root/go/bin:$PATH"

CMD ["make"]
