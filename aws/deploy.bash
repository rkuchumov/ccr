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

VPC_CIDR=10.2.0.0/16
VPC_PRIVATE_SUBNET=10.2.0.0/24
VPC_PUBLIC_SUBNET=10.2.1.0/24

APP_SG_NAME="atatata"
APP_SG_DESC="atatata"
APP_ISNT_USERDATA_TEMPLATE=app.bash
APP_ISNT_USERDATA=app.bash.tmp

TUNERS_SG_NAME="atatatata"
TUNERS_SG_DESC="atatatata"
TUNERS_INST_USERDATA_TEMPLATE=reciever.bash
TUNERS_INST_USERDATA=reciever.bash.tmp

DB_SG_NAME="atatatatata"
DB_SG_DESC="atatatatata"
DB_INST_USERDATA=db.bash

if [ -f $PROGRESS ]; then
	. $PROGRESS
fi

if [ -z $VPC_ID ]; then
	aws ec2 create-vpc --cidr-block $VPC_CIDR > $TMP

	VPC_ID=$(cat $TMP | jq -r '.Vpc.VpcId')
	echo VPC_ID=$VPC_ID >> $PROGRESS

	aws ec2 modify-vpc-attribute \
		--vpc-id $VPC_ID --enable-dns-hostnames "{\"Value\":true}"
	aws ec2 modify-vpc-attribute \
		--vpc-id $VPC_ID --enable-dns-support "{\"Value\":true}"
fi

if [ -z $VPC_PUBLIC_SUBNET_ID ]; then
	aws ec2 create-subnet \
		--vpc-id $VPC_ID --cidr-block $VPC_PUBLIC_SUBNET > $TMP

	VPC_PUBLIC_SUBNET_ID=$(cat $TMP | jq -r '.Subnet.SubnetId')
	echo VPC_PUBLIC_SUBNET_ID=$VPC_PUBLIC_SUBNET_ID >> $PROGRESS

	aws ec2 modify-subnet-attribute \
		--subnet-id $VPC_PUBLIC_SUBNET_ID --map-public-ip-on-launch
fi

if [ -z $VPC_PRIVATE_SUBNET_ID ]; then
	aws ec2 create-subnet \
		--vpc-id $VPC_ID --cidr-block $VPC_PRIVATE_SUBNET > $TMP

	VPC_PRIVATE_SUBNET_ID=$(cat $TMP | jq -r '.Subnet.SubnetId')
	echo VPC_PRIVATE_SUBNET_ID=$VPC_PRIVATE_SUBNET_ID >> $PROGRESS
fi

if [ -z $I_GW_ID ]; then
	aws ec2 create-internet-gateway > $TMP

	I_GW_ID=$(cat $TMP | jq -r '.InternetGateway.InternetGatewayId')
	echo I_GW_ID=$I_GW_ID>> $PROGRESS

	aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $I_GW_ID
fi

if [ -z $RT_ID ]; then
	aws ec2 create-route-table --vpc-id $VPC_ID > $TMP

	RT_ID=$(cat $TMP | jq -r '.RouteTable.RouteTableId')
	echo RT_ID=$RT_ID >> $PROGRESS

	aws ec2 create-route \
		--route-table-id $RT_ID \
		--destination-cidr-block 0.0.0.0/0 \
		--gateway-id $I_GW_ID

	aws ec2 associate-route-table \
		--subnet-id $VPC_PUBLIC_SUBNET_ID \
		--route-table-id $RT_ID > $TMP
	RT_ASSOC_ID=$(cat $TMP | jq -r '.AssociationId')
	echo RT_ASSOC_ID=$RT_ASSOC_ID >> $PROGRESS
fi

if [ -z $SG_APP_ID ]; then
	aws ec2 create-security-group \
		--vpc-id $VPC_ID \
		--description $APP_SG_NAME \
		--group-name $APP_SG_DESC > $TMP

	SG_APP_ID=$(cat $TMP | jq -r '.GroupId')
	echo SG_APP_ID=$SG_APP_ID >> $PROGRESS

	aws ec2 authorize-security-group-ingress \
		--group-id $SG_APP_ID \
		--ip-permissions '[{"IpProtocol": "tcp", "FromPort": 22, "ToPort": 22, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}]'
	aws ec2 authorize-security-group-ingress \
		--group-id $SG_APP_ID \
		--ip-permissions '[{"IpProtocol": "tcp", "FromPort": 80, "ToPort": 80, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}]'
fi

if [ -z $SG_TUNERS_ID ]; then
	aws ec2 create-security-group \
		--vpc-id $VPC_ID \
		--description $TUNERS_SG_NAME \
		--group-name $TUNERS_SG_DESC > $TMP

	SG_TUNERS_ID=$(cat $TMP | jq -r '.GroupId')
	echo SG_TUNERS_ID=$SG_TUNERS_ID >> $PROGRESS

	aws ec2 authorize-security-group-ingress \
		--group-id $SG_TUNERS_ID \
		--ip-permissions '[{"IpProtocol": "tcp", "FromPort": 22, "ToPort": 22, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}]'
	aws ec2 authorize-security-group-ingress \
		--group-id $SG_TUNERS_ID \
		--ip-permissions '[{"IpProtocol": "tcp", "FromPort": 5000, "ToPort": 5000, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}]'
fi

if [ -z $SG_DB_ID ]; then
	aws ec2 create-security-group \
		--vpc-id $VPC_ID \
		--description $DB_SG_NAME \
		--group-name $DB_SG_DESC > $TMP

	SG_DB_ID=$(cat $TMP | jq -r '.GroupId')
	echo SG_DB_ID=$SG_DB_ID >> $PROGRESS

	aws ec2 authorize-security-group-ingress \
		--group-id $SG_DB_ID \
		--ip-permissions '[{"IpProtocol": "tcp", "FromPort": 22, "ToPort": 22, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}]'
	aws ec2 authorize-security-group-ingress \
		--group-id $SG_DB_ID \
		--ip-permissions '[{"IpProtocol": "tcp", "FromPort": 27017, "ToPort": 27017, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}]'
fi

if [ -z $DB_INST_PUB_ID ] || [ -z $DB_INST_PUB_IP ]; then
	aws ec2 run-instances \
		--image-id $EC2_AMI --count 1 \
		--instance-type $EC2_INST_TYPE \
		--key-name $EC2_KEYPAIR \
		--security-group-ids $SG_DB_ID \
		--subnet-id $VPC_PUBLIC_SUBNET_ID \
		--user-data file://$DB_INST_USERDATA > $TMP 

	DB_INST_PUB_ID=$(cat $TMP | jq -r '.Instances[0].InstanceId')
	DB_INST_PUB_IP=$(cat $TMP | jq -r '.Instances[0].PrivateIpAddress')

	echo DB_INST_PUB_ID=$DB_INST_PUB_ID >> $PROGRESS
	echo DB_INST_PUB_IP=$DB_INST_PUB_IP >> $PROGRESS
fi

if [ -z $DB_IMAGE_ID ]; then
	IP=$(aws ec2 describe-instances --instance-ids $DB_INST_PUB_ID | jq -r '.Reservations[0].Instances[0].PublicIpAddress')

	until mongo mongodb://$IP:27017/ccr $DB_SEED_FILE
	do
		sleep $RETRY_DELAY
	done

	aws ec2 create-image --instance-id $DB_INST_PUB_ID --name "DB Server" > $TMP
	DB_IMAGE_ID=$(cat $TMP | jq -r '.ImageId')
	echo DB_IMAGE_ID=$DB_IMAGE_ID >> $PROGRESS

	until [[ 'available' ==  $(aws ec2 describe-images --image-ids $DB_IMAGE_ID | jq -r '.Images[].State') ]];
	do
		sleep $RETRY_DELAY
	done

	aws ec2 terminate-instances --instance-ids $DB_INST_PUB_ID
fi

if [ -z $DB_INST_PRIV_ID ] || [ -z $DB_INST_PRIV_IP ]; then
	aws ec2 run-instances \
		--image-id $DB_IMAGE_ID --count 1 \
		--instance-type $EC2_INST_TYPE \
		--key-name $EC2_KEYPAIR \
		--security-group-ids $SG_DB_ID \
		--subnet-id $VPC_PRIVATE_SUBNET_ID \
		--user-data file://$DB_INST_USERDATA > $TMP 

	DB_INST_PRIV_ID=$(cat $TMP | jq -r '.Instances[0].InstanceId')
	DB_INST_PRIV_IP=$(cat $TMP | jq -r '.Instances[0].PrivateIpAddress')

	echo DB_INST_PRIV_ID=$DB_INST_PRIV_ID >> $PROGRESS
	echo DB_INST_PRIV_IP=$DB_INST_PRIV_IP >> $PROGRESS
fi

if [ -z $TUNERS_INST_ID ] || [ -z $TUNERS_INST_IP ]; then
	sed "s/CCR_MONGO_HOST/$DB_INST_PRIV_IP/g" $TUNERS_INST_USERDATA_TEMPLATE > $TUNERS_INST_USERDATA

	aws ec2 run-instances \
		--image-id $EC2_AMI \
		--count 1 \
		--instance-type $EC2_INST_TYPE \
		--key-name $EC2_KEYPAIR \
		--security-group-ids $SG_TUNERS_ID \
		--subnet-id $VPC_PUBLIC_SUBNET_ID \
		--user-data file://$TUNERS_INST_USERDATA > $TMP 

	TUNERS_INST_ID=$(cat $TMP | jq -r '.Instances[0].InstanceId')
	TUNERS_INST_IP=$(cat $TMP | jq -r '.Instances[0].PrivateIpAddress')

	echo TUNERS_INST_ID=$TUNERS_INST_ID >> $PROGRESS
	echo TUNERS_INST_IP=$TUNERS_INST_IP >> $PROGRESS
fi

if [ -z $APP_INST_ID ] || [ -z $APP_INST_IP ]; then
	sed "s/CCR_MONGO_HOST/$DB_INST_PRIV_IP/g" $APP_ISNT_USERDATA_TEMPLATE  > $APP_ISNT_USERDATA

	aws ec2 run-instances \
		--image-id $EC2_AMI \
		--count 1 \
		--instance-type $EC2_INST_TYPE \
		--key-name $EC2_KEYPAIR \
		--security-group-ids $SG_APP_ID \
		--subnet-id $VPC_PUBLIC_SUBNET_ID \
		--user-data file://$APP_ISNT_USERDATA > $TMP 

	APP_INST_ID=$(cat $TMP | jq -r '.Instances[0].InstanceId')
	APP_INST_IP=$(cat $TMP | jq -r '.Instances[0].PrivateIpAddress')

	echo APP_INST_ID=$APP_INST_ID >> $PROGRESS
	echo APP_INST_IP=$APP_INST_IP >> $PROGRESS
fi

TUNERS_INST_IP_PUB=$(aws ec2 describe-instances --instance-ids $TUNERS_INST_ID | jq -r '.Reservations[0].Instances[0].PublicIpAddress')
APP_INST_IP_PUB=$(aws ec2 describe-instances --instance-ids $APP_INST_ID | jq -r '.Reservations[0].Instances[0].PublicIpAddress')

until nc -vz $TUNERS_INST_IP_PUB 5000
do
	sleep $RETRY_DELAY
done

until nc -vz $APP_INST_IP_PUB 80
do
	sleep $RETRY_DELAY
done

echo Reciever at tcp://$TUNERS_INST_IP_PUB:5000/
echo Web app at http://$APP_INST_IP_PUB/
echo "Done."
date
