FROM httpd
ADD httpd.conf /usr/local/apache2/conf
ADD httpd-vhosts.conf /usr/local/apache2/conf/extra
RUN mkdir -p /usr/local/apache2/htdocs/build 
ADD build /usr/local/apache2/htdocs/build
WORKDIR /usr/local/apache2
EXPOSE 80
