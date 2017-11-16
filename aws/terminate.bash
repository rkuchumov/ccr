#!/bin/bash

set -ex

TMP=output
PROGRESS=progress.env
RETRY_DELAY=30

DB_SEED_FILE=../database/seed/seed.js

REGION=us-east-1
EC2_AMI=ami-8c1be5f6
EC2_INST_TYPE=t2.nano
EC2_KEYPAIR=atata

if [ -f $PROGRESS ]; then
	. $PROGRESS
fi

function wait_inst_terminate() {
	until [[ 'terminated' ==  $(aws ec2 describe-instances --instance-id $1 | jq -r '.Reservations[0].Instances[0].State.Name') ]];
	do
		sleep $RETRY_DELAY
	done
}

if [ $APP_INST_ID ]; then
	aws ec2 terminate-instances --instance-ids $APP_INST_ID
fi

if [ $TUNERS_INST_ID ]; then
	aws ec2 terminate-instances --instance-ids $TUNERS_INST_ID
fi

if [ $DB_INST_PRIV_ID ]; then
	aws ec2 terminate-instances --instance-ids $DB_INST_PRIV_ID
fi

if [ $APP_INST_ID ]; then
	wait_inst_terminate $APP_INST_ID
	sed -i "/$APP_INST_ID/d" $PROGRESS
	sed -i "/$APP_INST_IP/d" $PROGRESS
fi

if [ $TUNERS_INST_ID ]; then
	wait_inst_terminate $TUNERS_INST_ID
	sed -i "/$TUNERS_INST_ID/d" $PROGRESS
	sed -i "/$TUNERS_INST_IP/d" $PROGRESS
fi

if [ $DB_INST_PRIV_ID ]; then
	wait_inst_terminate $DB_INST_PRIV_ID
	sed -i "/$DB_INST_PRIV_ID/d" $PROGRESS
	sed -i "/$DB_INST_PRIV_IP/d" $PROGRESS
	sed -i "/$DB_INST_PUB_ID/d" $PROGRESS
	sed -i "/$DB_INST_PUB_IP/d" $PROGRESS
fi

if [ $DB_IMAGE_ID ]; then
	aws ec2 deregister-image --image-id $DB_IMAGE_ID
	sed -i "/$DB_IMAGE_ID/d" $PROGRESS
fi

if [ $RT_ASSOC_ID ]; then
	aws ec2 disassociate-route-table --association-id $RT_ASSOC_ID
	sed -i "/$RT_ASSOC_ID/d" $PROGRESS
fi

if [ $RT_ID ]; then
	aws ec2 delete-route-table --route-table-id $RT_ID
	sed -i "/$RT_ID/d" $PROGRESS
fi

if [ $I_GW_ID ]; then
	aws ec2 detach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $I_GW_ID
	aws ec2 delete-internet-gateway --internet-gateway-id $I_GW_ID
	sed -i "/$I_GW_ID/d" $PROGRESS
fi

if [ $VPC_PRIVATE_SUBNET_ID ]; then
	aws ec2 delete-subnet --subnet-id $VPC_PRIVATE_SUBNET_ID
	sed -i "/$VPC_PRIVATE_SUBNET_ID/d" $PROGRESS
fi

if [ $VPC_PUBLIC_SUBNET_ID ]; then
	aws ec2 delete-subnet --subnet-id $VPC_PUBLIC_SUBNET_ID
	sed -i "/$VPC_PUBLIC_SUBNET_ID/d" $PROGRESS
fi

if [ $SG_APP_ID ]; then
	aws ec2 delete-security-group --group-id $SG_APP_ID
	sed -i "/$SG_APP_ID/d" $PROGRESS
fi

if [ $SG_TUNERS_ID ]; then
	aws ec2 delete-security-group --group-id $SG_TUNERS_ID
	sed -i "/$SG_TUNERS_ID/d" $PROGRESS
fi

if [ $SG_DB_ID ]; then
	aws ec2 delete-security-group --group-id $SG_DB_ID
	sed -i "/$SG_DB_ID/d" $PROGRESS
fi

if [ $VPC_ID ]; then
	aws ec2 delete-vpc --vpc-id $VPC_ID
	sed -i "/$VPC_ID/d" $PROGRESS
fi

