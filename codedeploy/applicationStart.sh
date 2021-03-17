#!/bin/bash

cd /home/ubuntu/webapp
sudo nohup npm start >> debug.log 2>&1 &