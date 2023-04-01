FROM python:3.9.10-alpine3.14
WORKDIR /app
RUN pip install --upgrade pip
RUN pip install flask
RUN pip install Jinja2
RUN pip install requests
COPY . .
ENV FLASK_APP=app
EXPOSE 5000
CMD ["python","app.py"]