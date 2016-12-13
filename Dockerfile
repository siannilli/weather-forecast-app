MAINTAINER Stefano Iannilli
# Build a new image from the base official nginx image (latest build)...
FROM nginx
# ... and copies the dist folder into the standard html's nginx serving folder
COPY ./dist /usr/share/nginx/html
