create database mialmacenwebdb;

use mialmacenwebdb;

create table user(
	id int not null auto_increment primary key,
	username varchar(35) not null,
	email varchar(150) not null,
	password varchar(200) not null,
	state bit not null, 
	create_at datetime not null default current_timestamp
);

insert user(username,email,password,state) values('ingresesuusuario','ingresesuemail','12345',1);

select * from user where (username='' or email='') and state=1;JO

update user set password = '$2b$10$0l.KuC0CmVyB40Dk6j6Rcej02aHVH6qZtUkWgsn5QrOyOEKw5zqDW' where id =1;