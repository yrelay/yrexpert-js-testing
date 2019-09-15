#!/usr/bin/env bash
#!----------------------------------------------------------------------------!
#!                                                                            !
#! YRexpert : (Your Yrelay) Système Expert sous Mumps GT.M et GNU/Linux       !
#! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
#!                                                                            !
#!----------------------------------------------------------------------------!
# docker-entrypoint.sh

echo '!----------------------------------------------------------------------------!'
echo
echo 'IP = ' `hostname -I`
echo
echo '!----------------------------------------------------------------------------!'

service ssh restart
service yrelayyrexpert restart
service yrelayyrexpert-js restart
bash
