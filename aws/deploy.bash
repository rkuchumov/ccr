#!/bin/bash

set -ex

TMP=output

VPC_CIDR=10.2.0.0/16
VPC_PRIVATE_SUBNET=10.2.0.0/24
VPC_PUBLIC_SUBNET=10.2.1.0/24

SG_WEB_NAME="atatata"
SG_WEB_DESC="atatata"

SG_TUNERS_NAME="atatatata"
SG_TUNERS_DESC="atatatata"

SG_DB_NAME="atatatatata"
SG_DB_DESC="atatatatata"

VPC_ID=vpc-36c8624e
VPC_PUBLIC_SUBNET_ID=subnet-4043c924
VPC_PRIVATE_SUBNET_ID=subnet-bd4cc6d9
I_GW_ID=igw-493e8230
RT_ID=rtb-1fe4ad65

SG_WEB_ID=sg-10b38662
SG_TUNERS_ID=sg-e9ba8f9b
SG_DB_ID=sg-2cba8f5e

if [ -z $VPC_ID ]; then
	aws ec2 create-vpc --cidr-block $VPC_CIDR > $TMP
	VPC_ID=$(cat $TMP | jq -r '.Vpc.VpcId')
	aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-support "{\"Value\":true}"
fi

if [ -z $VPC_PUBLIC_SUBNET_ID ]; then
	aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block $VPC_PUBLIC_SUBNET > $TMP
	VPC_PUBLIC_SUBNET_ID=$(cat $TMP | jq -r '.Subnet.SubnetId')
fi

if [ -z $VPC_PRIVATE_SUBNET_ID ]; then
	aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block $VPC_PRIVATE_SUBNET > $TMP
	VPC_PRIVATE_SUBNET_ID=$(cat $TMP | jq -r '.Subnet.SubnetId')
fi

if [ -z $I_GW_ID ]; then
	aws ec2 create-internet-gateway > $TMP
	I_GW_ID=$(cat $TMP | jq -r '.InternetGateway.InternetGatewayId')
	aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $I_GW_ID
fi

if [ -z $RT_ID ]; then
	aws ec2 create-route-table --vpc-id $VPC_ID > $TMP
	RT_ID=$(cat $TMP | jq -r '.RouteTable.RouteTableId')
	aws ec2 create-route --route-table-id $RT_ID  --destination-cidr-block 0.0.0.0/0 --gateway-id $I_GW_ID
	aws ec2 associate-route-table  --subnet-id $VPC_PUBLIC_SUBNET_ID --route-table-id $RT_ID
fi

if [ -z $SG_WEB_ID ]; then
	aws ec2 create-security-group --vpc-id $VPC_ID --description $SG_WEB_NAME --group-name $SG_WEB_DESC > $TMP
	SG_WEB_ID=$(cat $TMP | jq -r '.GroupId')

	aws ec2 authorize-security-group-ingress \
		--group-id $SG_WEB_ID \
		--ip-permissions '[{"IpProtocol": "tcp", "FromPort": 22, "ToPort": 22, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}]'
	aws ec2 authorize-security-group-ingress \
		--group-id $SG_WEB_ID \
		--ip-permissions '[{"IpProtocol": "tcp", "FromPort": 80, "ToPort": 80, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}]'
	aws ec2 authorize-security-group-ingress \
		--group-id $SG_WEB_ID \
		--ip-permissions '[{"IpProtocol": "icmp", "FromPort": 3, "ToPort": 4, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}]'
fi

if [ -z $SG_TUNERS_ID ]; then
	aws ec2 create-security-group --vpc-id $VPC_ID --description $SG_TUNERS_NAME --group-name $SG_TUNERS_DESC > $TMP
	SG_TUNERS_ID=$(cat $TMP | jq -r '.GroupId')

	aws ec2 authorize-security-group-ingress \
		--group-id $SG_TUNERS_ID \
		--ip-permissions '[{"IpProtocol": "tcp", "FromPort": 22, "ToPort": 22, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}]'
	aws ec2 authorize-security-group-ingress \
		--group-id $SG_TUNERS_ID \
		--ip-permissions '[{"IpProtocol": "tcp", "FromPort": 5000, "ToPort": 5000, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}]'
	aws ec2 authorize-security-group-ingress \
		--group-id $SG_TUNERS_ID \
		--ip-permissions '[{"IpProtocol": "icmp", "FromPort": 3, "ToPort": 4, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}]'
fi

if [ -z $SG_DB_ID ]; then
	aws ec2 create-security-group --vpc-id $VPC_ID --description $SG_DB_NAME --group-name $SG_DB_DESC > $TMP
	SG_DB_ID=$(cat $TMP | jq -r '.GroupId')

	aws ec2 authorize-security-group-ingress \
		--group-id $SG_DB_ID \
		--ip-permissions '[{"IpProtocol": "tcp", "FromPort": 22, "ToPort": 22, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}]'
	aws ec2 authorize-security-group-ingress \
		--group-id $SG_DB_ID \
		--ip-permissions '[{"IpProtocol": "tcp", "FromPort": 27017, "ToPort": 27017, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}]'
	aws ec2 authorize-security-group-ingress \
		--group-id $SG_DB_ID \
		--ip-permissions '[{"IpProtocol": "icmp", "FromPort": 3, "ToPort": 4, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}]'
fi

