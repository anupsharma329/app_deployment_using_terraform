terraform {
    required_providers {
        aws = {
            source  = "hashicorp/aws"
            version = "5.55.0"
        }
    }
}


    provider "aws" {
        region = "us-east-1"
    }

    # Create SSH Key Pair
    resource "aws_key_pair" "deployer" {
        key_name   = "deployer-key-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"
        public_key = file("~/.ssh/id_rsa.pub")  # Use your existing public key
    }

    # Security Group for EC2
    resource "aws_security_group" "allow_ssh_http" {
        vpc_id = aws_vpc.main.id
        name_prefix = "allow_ssh_http"
        description = "Allow SSH and HTTP traffic"

        ingress {
            from_port   = 22
            to_port     = 22
            protocol    = "tcp"
            cidr_blocks = ["0.0.0.0/0"]  # Change this to your IP for security
        }

        ingress {
            from_port   = 80
            to_port     = 80
            protocol    = "tcp"
            cidr_blocks = ["0.0.0.0/0"]
        }

        ingress {
            from_port   = 3000
            to_port     = 3000
            protocol    = "tcp"
            cidr_blocks = ["0.0.0.0/0"]
        }

        egress {
            from_port   = 0
            to_port     = 0
            protocol    = "-1"
            cidr_blocks = ["0.0.0.0/0"]
        }
    }

    resource "aws_vpc" "main" {
        cidr_block = "10.0.0.0/16"
    }

    resource "aws_subnet" "public" {
        vpc_id     = aws_vpc.main.id
        cidr_block = "10.0.1.0/24"
    }

    resource "aws_instance" "my_ec2" {
        ami                    = "ami-0b6c6ebed2801a5cb" # Ubuntu Linux 2 AMI
        instance_type          = "t2.micro"
        subnet_id              = aws_subnet.public.id
        vpc_security_group_ids = [aws_security_group.allow_ssh_http.id]
        key_name               = aws_key_pair.deployer.key_name
        associate_public_ip_address = true

        user_data = <<-EOF
                    #!/bin/bash
                    yum update -y
                    yum install -y nodejs git
                    npm install -g pm2
                    EOF

        tags = {
            Name = "DemoInstance-${terraform.workspace}"
        }
    }

    # Outputs
    output "ec2_public_ip" {
        description = "The public IP of the EC2 instance"
        value       = aws_instance.my_ec2.public_ip
    }

    output "ec2_instance_id" {
        description = "The ID of the EC2 instance"
        value       = aws_instance.my_ec2.id
    }