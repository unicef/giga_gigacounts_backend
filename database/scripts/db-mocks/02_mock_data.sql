/* ISPs Contract Managers */
INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'ISP CM 1', 'Brazil', 'isp.cm1.brazil@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BR'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, '0x93d0D2b299865C488e6C2ff6BF0B39e1BdB63422', NULL, 'EN', 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'ISP CM 2', 'Brazil', 'isp.cm2.brazil@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BR'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN', 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'ISP CM 1', 'Botswana', 'isp.cm1.botswana@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BW'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, '0x7D680C1E21b7360aB5Cc89aDe494BDA91Dd69be9', NULL, 'EN', 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'ISP CM 2', 'Botswana', 'isp.cm2.botswana@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BW'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN', 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');


/* ISPs Customer Service Agents */
INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'ISP Serv. Agent 1', 'Brazil', 'isp.sa1.brazil@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BR'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'ISP Serv. Agent 2', 'Brazil', 'isp.sa2.brazil@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BR'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'ISP Serv. Agent 1', 'Botswana', 'isp.sa1.botswana@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BW'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'ISP Serv. Agent 2', 'Botswana', 'isp.sa2.botswana@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BW'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');


/* Country Contract Creators */
INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'CC 1', 'Brazil', 'cc1.brazil@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BR'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'CC 2', 'Brazil', 'cc2.brazil@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BR'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'CC 1', 'Botswana', 'cc1.botswana@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BW'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'CC 2', 'Botswana', 'cc2.botswana@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BW'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');


/* Country Accountants */
INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'CA 1', 'Brazil', 'ca1.brazil@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BR'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'CA 2', 'Brazil', 'ca2.brazil@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BR'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'CA 1', 'Botswana', 'ca1.botswana@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BW'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'CA 2', 'Botswana', 'ca2.botswana@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BW'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');


/* Country Super Admins */
INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'C. Admin 1', 'Brazil', 'admin1.brazil@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BR'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'C. Admin 1', 'Botswana', 'admin1.botswana@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BW'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

/* Country Monitors */
INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'Monitor 1', 'Brazil', 'monitor1.brazil@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BR'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'Monitor 1', 'Botswana', 'monitor1.botswana@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BW'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');


/* School Connectivity Managers */
INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'SCH Manager 1', 'Brazil', 'sch.manager1.brazil@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BR'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'SCH Manager 2', 'Brazil', 'sch.manager2.brazil@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BR'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'SCH Manager 3', 'Brazil', 'sch.manager3.brazil@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BR'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'SCH Manager 1', 'Botswana', 'sch.manager1.botswana@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BW'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'SCH Manager 2', 'Botswana', 'sch.manager2.botswana@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BW'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');

INSERT INTO public.users (id, name, last_name, email, password, country_id, created_at, updated_at, safe_id, wallet_address, wallet_request_string, default_language, about, address, zip_code, phone_number, photo_url) 
VALUES (nextval('users_id_seq'), 'SCH Manager 3', 'Botswana', 'sch.manager3.botswana@giga.com', '$argon2id$v=19$t=3,m=4096,p=1$UATswoa8reg2n214IJF32g$7UeFUIhnAQn+VbrLo6en1K0JDc0bR8vG0wnxDqXU4Ns', (select id from countries where code = 'BW'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'EN' , 'something about me', '90210 Broadway Blvd', '94116', '+40 777666555', 'https://i.ibb.co/GVV63pf/avatar-default.jpg');


INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'isp.cm1.brazil@giga.com'), (select id from roles where code = 'ISP.CONTRACT.MANAGER') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'isp.cm2.brazil@giga.com'), (select id from roles where code = 'ISP.CONTRACT.MANAGER') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'isp.cm1.botswana@giga.com'), (select id from roles where code = 'ISP.CONTRACT.MANAGER') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'isp.cm2.botswana@giga.com'), (select id from roles where code = 'ISP.CONTRACT.MANAGER') , CURRENT_TIMESTAMP, NULL);

INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'isp.sa1.brazil@giga.com'), (select id from roles where code = 'ISP.CUSTOMER.SERVICE') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'isp.sa2.brazil@giga.com'), (select id from roles where code = 'ISP.CUSTOMER.SERVICE') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'isp.sa1.botswana@giga.com'), (select id from roles where code = 'ISP.CUSTOMER.SERVICE') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'isp.sa2.botswana@giga.com'), (select id from roles where code = 'ISP.CUSTOMER.SERVICE') , CURRENT_TIMESTAMP, NULL);

INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'cc1.brazil@giga.com'), (select id from roles where code = 'COUNTRY.CONTRACT.CREATOR') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'cc2.brazil@giga.com'), (select id from roles where code = 'COUNTRY.CONTRACT.CREATOR') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'cc1.botswana@giga.com'), (select id from roles where code = 'COUNTRY.CONTRACT.CREATOR') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'cc2.botswana@giga.com'), (select id from roles where code = 'COUNTRY.CONTRACT.CREATOR') , CURRENT_TIMESTAMP, NULL);

INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'ca1.brazil@giga.com'), (select id from roles where code = 'COUNTRY.ACCOUNTANT') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'ca2.brazil@giga.com'), (select id from roles where code = 'COUNTRY.ACCOUNTANT') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'ca1.botswana@giga.com'), (select id from roles where code = 'COUNTRY.ACCOUNTANT') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'ca2.botswana@giga.com'), (select id from roles where code = 'COUNTRY.ACCOUNTANT') , CURRENT_TIMESTAMP, NULL);

INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'admin1.brazil@giga.com'), (select id from roles where code = 'COUNTRY.SUPER.ADMIN') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'admin1.botswana@giga.com'), (select id from roles where code = 'COUNTRY.SUPER.ADMIN') , CURRENT_TIMESTAMP, NULL);

INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'monitor1.brazil@giga.com'), (select id from roles where code = 'COUNTRY.MONITOR') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'monitor1.botswana@giga.com'), (select id from roles where code = 'COUNTRY.MONITOR') , CURRENT_TIMESTAMP, NULL);

INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'sch.manager1.brazil@giga.com'), (select id from roles where code = 'SCHOOL.CONNECTIVITY.MANAGER') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'sch.manager2.brazil@giga.com'), (select id from roles where code = 'SCHOOL.CONNECTIVITY.MANAGER') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'sch.manager3.brazil@giga.com'), (select id from roles where code = 'SCHOOL.CONNECTIVITY.MANAGER') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'sch.manager1.botswana@giga.com'), (select id from roles where code = 'SCHOOL.CONNECTIVITY.MANAGER') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'sch.manager2.botswana@giga.com'), (select id from roles where code = 'SCHOOL.CONNECTIVITY.MANAGER') , CURRENT_TIMESTAMP, NULL);
INSERT INTO public.user_roles (id, user_id, role_id, created_at, updated_at) 
VALUES (nextval('user_roles_id_seq'), (select id from users where email = 'sch.manager3.botswana@giga.com'), (select id from roles where code = 'SCHOOL.CONNECTIVITY.MANAGER') , CURRENT_TIMESTAMP, NULL);

insert into public.isp_users (id, user_id, isp_id, created_at, updated_at) select nextval('isp_users_id_seq'), u.id, (select id from isps where upper(name) ='VIVO'), CURRENT_TIMESTAMP, null from users u where name like '%ISP%' and email like '%brazil%';
insert into public.isp_users (id, user_id, isp_id, created_at, updated_at) select nextval('isp_users_id_seq'), u.id, (select id from isps where upper(name) ='AT&T BOTSWANA'), CURRENT_TIMESTAMP, null from users u where name like '%ISP%' and email like '%botswana%';

insert into school_users (id, user_id, school_id, created_at, updated_at) values(nextval('school_users_id_seq'), (select id from users where email = 'sch.manager1.brazil@giga.com'), (select id from schools where external_id = '1807003088'), CURRENT_TIMESTAMP, null);
insert into school_users (id, user_id, school_id, created_at, updated_at) values(nextval('school_users_id_seq'), (select id from users where email = 'sch.manager2.brazil@giga.com'), (select id from schools where external_id = '1807003088'), CURRENT_TIMESTAMP, null);
insert into school_users (id, user_id, school_id, created_at, updated_at) values(nextval('school_users_id_seq'), (select id from users where email = 'sch.manager3.brazil@giga.com'), (select id from schools where external_id = '1807003088'), CURRENT_TIMESTAMP, null);

INSERT INTO public.ltas (id, name, created_by, created_at, updated_at, country_id) select nextval('ltas_id_seq'), 'LLTS-' || FLOOR(random() * (84554332 - 44552312 + 1) + 44552312), NULL, NULL, NULL, id from countries;
INSERT INTO public.ltas (id, name, created_by, created_at, updated_at, country_id) select nextval('ltas_id_seq'), 'LLTS-' || FLOOR(random() * (34554332 - 14552312 + 1) + 14552312), NULL, NULL, NULL, id from countries;
INSERT INTO public.ltas (id, name, created_by, created_at, updated_at, country_id) select nextval('ltas_id_seq'), 'LLTS-' || FLOOR(random() * (74554332 - 24552312 + 1) + 24552312), NULL, NULL, NULL, id from countries;

INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date) VALUES (nextval('contracts_id_seq'), (select id from countries where code = 'BR'), true, '8412140', 5, (select id from currencies where code = 'BRL'), 1000000.00, 1, '2022-05-10 01:35:57-03', '2022-08-20 01:35:57.001-03', 3, 3, 3, '2023-04-30 01:35:57.003-03', '2023-04-30 01:35:57.003-03', '2023-04-30 01:35:57.003-03');
INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date) VALUES (nextval('contracts_id_seq'), (select id from countries where code = 'BR'), true, '8412141', 5, (select id from currencies where code = 'BRL'), 1000000.00, 1, '2021-03-09 01:35:57.076-03', '2021-09-06 01:35:57.076-03', 3, 3, 5, '2023-04-30 01:35:57.077-03', '2023-04-30 01:35:57.077-03', '2023-04-30 01:35:57.077-03');
INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date) VALUES (nextval('contracts_id_seq'), (select id from countries where code = 'BR'), true, '8412142', 5, (select id from currencies where code = 'BRL'), 1000000.00, 1, '2020-03-11 01:35:57.113-03', '2020-10-13 01:35:57.114-03', 3, 3, 5, '2023-04-30 01:35:57.116-03', '2023-04-30 01:35:57.116-03', '2023-04-30 01:35:57.116-03');
INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date) VALUES (nextval('contracts_id_seq'), (select id from countries where code = 'BR'), false, '7287574', 5, (select id from currencies where code = 'BRL'), 1000000.00, 1, '2021-03-01 01:35:57.139-03', '2021-09-30 01:35:57.139-03', 8, 3, 5, '2023-04-30 01:35:57.14-03', '2023-04-30 01:35:57.14-03', '2023-04-30 01:35:57.14-03');
INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date) VALUES (nextval('contracts_id_seq'), (select id from countries where code = 'BR'), false, '7287575', 5, (select id from currencies where code = 'BRL'), 1000000.00, 1, '2020-03-02 01:35:57.166-03', '2020-10-23 01:35:57.166-03', 8, 3, 5, '2023-04-30 01:35:57.168-03', '2023-04-30 01:35:57.168-03', '2023-04-30 01:35:57.168-03');
INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date) VALUES (nextval('contracts_id_seq'), (select id from countries where code = 'BR'), false, '7287576', 5, (select id from currencies where code = 'BRL'), 1000000.00, 1, '2019-10-25 01:35:57.208-03', '2020-07-10 01:35:57.208-03', 8, 3, 5, '2023-04-30 01:35:57.21-03', '2023-04-30 01:35:57.21-03', '2023-04-30 01:35:57.21-03');
INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date) VALUES (nextval('contracts_id_seq'), (select id from countries where code = 'BR'), false, '4949780', 5, (select id from currencies where code = 'BRL'), 1000000.00, 1, '2022-11-13 01:35:57.248-03', '2023-07-12 01:35:57.248-03', 2, 3, 1, '2023-04-30 01:35:57.249-03', '2023-04-30 01:35:57.249-03', '2023-04-30 01:35:57.249-03');
INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date) VALUES (nextval('contracts_id_seq'), (select id from countries where code = 'BR'), false, '5079401', 5, (select id from currencies where code = 'BRL'), 1000000.00, 1, '2022-11-16 01:35:57.257-03', '2023-07-05 01:35:57.257-03', 2, 3, 2, '2023-04-30 01:35:57.258-03', '2023-04-30 01:35:57.258-03', '2023-04-30 01:35:57.258-03');
INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date) VALUES (nextval('contracts_id_seq'), (select id from countries where code = 'BR'), false, '6934334', 5, (select id from currencies where code = 'BRL'), 1000000.00, 1, '2022-04-13 01:35:57.266-03', '2022-08-20 01:35:57.266-03', 10, 3, 3, '2023-04-30 01:35:57.267-03', '2023-04-30 01:35:57.267-03', '2023-04-30 01:35:57.267-03');
INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date) VALUES (nextval('contracts_id_seq'), (select id from countries where code = 'BR'), true, '9020161', 5, (select id from currencies where code = 'BRL'), 1000000.00, 1, '2022-04-09 01:35:57.297-03', '2022-11-10 01:35:57.297-03', 11, 3, 3, '2023-04-30 01:35:57.298-03', '2023-04-30 01:35:57.298-03', '2023-04-30 01:35:57.298-03');
INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date) VALUES (nextval('contracts_id_seq'), (select id from countries where code = 'BR'), false, '5631506', 5, (select id from currencies where code = 'BRL'), 1000000.00, 1, '2022-06-15 01:35:57.327-03', '2022-10-12 01:35:57.327-03', 6, 3, 3, '2023-04-30 01:35:57.328-03', '2023-04-30 01:35:57.328-03', '2023-04-30 01:35:57.328-03');
INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date) VALUES (nextval('contracts_id_seq'), (select id from countries where code = 'BR'), false, '2526207', 5, (select id from currencies where code = 'BRL'), 1000000.00, 1, '2022-10-01 01:35:57.353-03', '2023-01-18 01:35:57.353-03', 2, 3, 3, '2023-04-30 01:35:57.354-03', '2023-04-30 01:35:57.354-03', '2023-04-30 01:35:57.354-03');
INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date) VALUES (nextval('contracts_id_seq'), (select id from countries where code = 'BR'), true, '2154531', 5, (select id from currencies where code = 'BRL'), 1000000.00, 1, '2021-12-16 01:35:57.383-03', '2022-07-01 01:35:57.383-03', 5, 3, 4, '2023-04-30 01:35:57.384-03', '2023-04-30 01:35:57.384-03', '2023-04-30 01:35:57.384-03');
INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date) VALUES (nextval('contracts_id_seq'), (select id from countries where code = 'BR'), false, '6483012', 5, (select id from currencies where code = 'BRL'), 1000000.00, 1, '2021-12-31 01:35:57.41-03', '2022-03-14 01:35:57.41-03', 9, 3, 4, '2023-04-30 01:35:57.412-03', '2023-04-30 01:35:57.412-03', '2023-04-30 01:35:57.412-03');
INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date) VALUES (nextval('contracts_id_seq'), (select id from countries where code = 'BR'), true, '2364146', 5, (select id from currencies where code = 'BRL'), 1000000.00, 1, '2021-04-04 01:35:57.438-03', '2021-09-06 01:35:57.438-03', 8, 3, 5, '2023-04-30 01:35:57.439-03', '2023-04-30 01:35:57.439-03', '2023-04-30 01:35:57.439-03');
INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date) VALUES (nextval('contracts_id_seq'), (select id from countries where code = 'BR'), true, '1089794', 5, (select id from currencies where code = 'BRL'), 1000000.00, 1, '2020-03-27 01:35:57.466-03', '2020-10-13 01:35:57.466-03', 11, 3, 5, '2023-04-30 01:35:57.467-03', '2023-04-30 01:35:57.467-03', '2023-04-30 01:35:57.467-03');
INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date) VALUES (nextval('contracts_id_seq'), (select id from countries where code = 'BR'), false, '5804450', 5, (select id from currencies where code = 'BRL'), 1000000.00, 1, '2021-04-22 01:35:57.479-03', '2021-07-30 01:35:57.479-03', 12, 3, 5, '2023-04-30 01:35:57.48-03', '2023-04-30 01:35:57.48-03', '2023-04-30 01:35:57.48-03');
INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date, automatic) VALUES (nextval('contracts_id_seq'), (select id from countries where code = 'BR'), false, '5804470', 5, (select id from currencies where code = 'GCTK' and network_id = '80001'), 1000000.00, 1, '2021-04-22 01:35:57.479-03', '2021-07-30 01:35:57.479-03', 12, 3, 5, '2023-04-30 01:35:57.48-03', '2023-04-30 01:35:57.48-03', '2023-04-30 01:35:57.48-03', true);

INSERT INTO public.contracts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, status, created_at, updated_at, launch_date) 
select 	nextval('contracts_id_seq'), u.country_id, 
		(case when r.code = 'GIGA.SUPER.ADMIN' then true else false end) as x,
		FLOOR(random() * (24554332 - 24552312 + 1) + 24552312) as cname, l.id,
		(select id from currencies where code = 'USD'),
		FLOOR(random() * (10000 - 50000 + 1) + 50000) as budget,
		(select id from frequencies where name = 'Monthly') as fcy,
		CURRENT_TIMESTAMP - INTERVAL '20 days' as startDate,
		CURRENT_TIMESTAMP + INTERVAL '90 days' as endDate,
		(select i.id from isps i inner join isp_users iu on iu.isp_id = i.id inner join users u on u.id = iu.id limit 1) as isp, 
		u.id as createdBy, (select id from contract_status where code = 'SENT'), 
		CURRENT_TIMESTAMP - INTERVAL '20 days' as createdAt,
		null as updatedAt, 
		CURRENT_TIMESTAMP + INTERVAL '10 days' as launchDate
from roles r
inner join user_roles ur
on ur.role_id = r.id
inner join users u
on ur.user_id = u.id
inner join ltas l
on u.country_id = l.country_id
where r.code in ('GIGA.SUPER.ADMIN', 'COUNTRY.CONTRACT.CREATOR')
and u.country_id in (select country_id from isps);


INSERT INTO public.drafts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, schools, expected_metrics, created_at, updated_at, launch_date) VALUES (nextval('drafts_id_seq'), (select id from countries where code = 'BR'), true, 'D9393487', 1, (SELECT id from currencies where code = 'BRL'), 1000, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP+ INTERVAL '90 days', (select id from isps where upper(name) = 'VIVO'), 1, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,  CURRENT_TIMESTAMP+ INTERVAL '10 days');
INSERT INTO public.drafts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, schools, expected_metrics, created_at, updated_at, launch_date) VALUES (nextval('drafts_id_seq'), (select id from countries where code = 'BR'), true, 'D1233333', 1, (SELECT id from currencies where code = 'BRL'), 1000, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP+ INTERVAL '60 days', (select id from isps where upper(name) = 'VIVO'), 1, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,  CURRENT_TIMESTAMP+ INTERVAL '10 days');
INSERT INTO public.drafts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, schools, expected_metrics, created_at, updated_at, launch_date) VALUES (nextval('drafts_id_seq'), (select id from countries where code = 'BR'), true, 'DTESTTEST11', 1, (SELECT id from currencies where code = 'BRL'), 1000, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP+ INTERVAL '70 days', (select id from isps where upper(name) = 'VIVO'), 1, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,  CURRENT_TIMESTAMP+ INTERVAL '10 days');
INSERT INTO public.drafts (id, country_id, government_behalf, name, lta_id, currency_id, budget, frequency_id, start_date, end_date, isp_id, created_by, schools, expected_metrics, created_at, updated_at, launch_date, automatic) VALUES (nextval('drafts_id_seq'), (select id from countries where code = 'BR'), true, 'DTESTTEST22', 1, (SELECT id from currencies where code = 'BRL'), 1000, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP+ INTERVAL '70 days', (select id from isps where upper(name) = 'VIVO'), 1, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,  CURRENT_TIMESTAMP+ INTERVAL '10 days', true);

INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 1, 1, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 2, 1, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 3, 1, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 4, 1, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 5, 2, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 6, 2, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 7, 2, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 8, 2, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 9, 3, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 10, 4, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 11, 5, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 12, 5, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 13, 5, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 14, 5, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 15, 6, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 16, 6, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 17, 6, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 18, 6, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 19, 6, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 20, 7, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 21, 8, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 22, 9, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 23, 9, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 24, 9, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 25, 9, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 26, 9, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 27, 10, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 28, 10, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 29, 10, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 30, 10, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 31, 10, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 32, 11, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 33, 11, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 34, 11, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 35, 11, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 36, 11, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 37, 12, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 38, 12, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 39, 12, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 40, 12, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 41, 12, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 42, 13, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 43, 13, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 44, 13, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 45, 13, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 46, 13, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 47, 14, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 48, 14, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 49, 14, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 50, 14, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 51, 14, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 52, 15, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 53, 15, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 54, 15, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 55, 15, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 56, 15, 10000.00);
INSERT INTO public.school_contracts (id, school_id, contract_id, budget) VALUES (nextval('school_contracts_id_seq'), 57, 16, 10000.00);

INSERT INTO public.expected_metrics (id, contract_id, metric_id, value, created_at, updated_at) select nextval('expected_metrics_id_seq'), id, 1, FLOOR(random() * (100 - 2 + 1) + 2) as random, CURRENT_TIMESTAMP, NULL from contracts;
INSERT INTO public.expected_metrics (id, contract_id, metric_id, value, created_at, updated_at) select nextval('expected_metrics_id_seq'), id, 2, FLOOR(random() * (100 - 2 + 1) + 2) as random, CURRENT_TIMESTAMP, NULL from contracts;
INSERT INTO public.expected_metrics (id, contract_id, metric_id, value, created_at, updated_at) select nextval('expected_metrics_id_seq'), id, 3, FLOOR(random() * (100 - 2 + 1) + 2) as random, CURRENT_TIMESTAMP, NULL from contracts;
INSERT INTO public.expected_metrics (id, contract_id, metric_id, value, created_at, updated_at) select nextval('expected_metrics_id_seq'), id, 4, FLOOR(random() * (100 - 2 + 1) + 2) as random, CURRENT_TIMESTAMP, NULL from contracts;

INSERT INTO public.measures (id, metric_id, value, school_id, created_at, updated_at, contract_id) select nextval('measures_id_seq'), 1, FLOOR(random() * (100 - 0 + 1) + 0) as random, s.id, CURRENT_TIMESTAMP, NULL, c.id from contracts c inner join school_contracts sc on sc.contract_id = c.id inner join schools s on s.id = sc.school_id;
INSERT INTO public.measures (id, metric_id, value, school_id, created_at, updated_at, contract_id) select nextval('measures_id_seq'), 2, FLOOR(random() * (100 - 0 + 1) + 0) as random, s.id, CURRENT_TIMESTAMP, NULL, c.id from contracts c inner join school_contracts sc on sc.contract_id = c.id inner join schools s on s.id = sc.school_id;
INSERT INTO public.measures (id, metric_id, value, school_id, created_at, updated_at, contract_id) select nextval('measures_id_seq'), 3, FLOOR(random() * (100 - 0 + 1) + 0) as random, s.id, CURRENT_TIMESTAMP, NULL, c.id from contracts c inner join school_contracts sc on sc.contract_id = c.id inner join schools s on s.id = sc.school_id;
INSERT INTO public.measures (id, metric_id, value, school_id, created_at, updated_at, contract_id) select nextval('measures_id_seq'), 4, FLOOR(random() * (100 - 0 + 1) + 0) as random, s.id, CURRENT_TIMESTAMP, NULL, c.id from contracts c inner join school_contracts sc on sc.contract_id = c.id inner join schools s on s.id = sc.school_id;

INSERT INTO public.payments (id, date_from, date_to, invoice_id, receipt_id, is_verified, contract_id, paid_by, amount, currency_id, created_at, updated_at, description, status, created_by, metrics) VALUES (nextval('payments_id_seq'), CURRENT_TIMESTAMP, '2022-05-01 02:59:59.999+00', NULL, NULL, false, 9, NULL, 123, (select id from currencies where code = 'BRL'), '2023-05-05 09:47:33.847+00', '2023-05-05 09:47:33.847+00', '', 2, 1, '{"connectionsMedian": [], "withoutConnection": 100, "allEqualOrAboveAvg": 0, "atLeastOneBellowAvg": 0}');
INSERT INTO public.payments (id, date_from, date_to, invoice_id, receipt_id, is_verified, contract_id, paid_by, amount, currency_id, created_at, updated_at, description, status, created_by, metrics) VALUES (nextval('payments_id_seq'), CURRENT_TIMESTAMP, '2022-07-01 02:59:59.999+00', NULL, NULL, false, 9, NULL, 2222, (select id from currencies where code = 'BRL'), '2023-05-05 10:10:21.56+00', '2023-05-05 10:10:21.56+00', '222', 2, 1, '{"connectionsMedian": [], "withoutConnection": 100, "allEqualOrAboveAvg": 0, "atLeastOneBellowAvg": 0}');
INSERT INTO public.payments (id, date_from, date_to, invoice_id, receipt_id, is_verified, contract_id, paid_by, amount, currency_id, created_at, updated_at, description, status, created_by, metrics) VALUES (nextval('payments_id_seq'), CURRENT_TIMESTAMP, '2022-06-01 02:59:59.999+00', NULL, NULL, false, 9, NULL, 222, (select id from currencies where code = 'BRL'), '2023-05-05 10:11:59.487+00', '2023-05-05 10:11:59.487+00', '23232', 2, 1, '{"connectionsMedian": [], "withoutConnection": 100, "allEqualOrAboveAvg": 0, "atLeastOneBellowAvg": 0}');
INSERT INTO public.payments (id, date_from, date_to, invoice_id, receipt_id, is_verified, contract_id, paid_by, amount, currency_id, created_at, updated_at, description, status, created_by, metrics) VALUES (nextval('payments_id_seq'), CURRENT_TIMESTAMP, '2022-01-01 02:59:59.999+00', NULL, NULL, false, 13, NULL, 2, (select id from currencies where code = 'BRL'), '2023-06-06 20:48:59.285+00', '2023-06-06 20:49:40.472+00', 'test', 2, 3, '{"connectionsMedian": [], "withoutConnection": 100, "allEqualOrAboveAvg": 0, "atLeastOneBellowAvg": 0}');
INSERT INTO public.payments (id, date_from, date_to, invoice_id, receipt_id, is_verified, contract_id, paid_by, amount, currency_id, created_at, updated_at, description, status, created_by, metrics) VALUES (nextval('payments_id_seq'), CURRENT_TIMESTAMP, '2022-01-01 02:59:59.999+00', NULL, NULL, false, 13, NULL, 2, (select id from currencies where code = 'BRL'), '2023-06-06 20:48:59.285+00', '2023-06-06 20:49:40.472+00', 'test2', 1, 3, '{"connectionsMedian": [], "withoutConnection": 100, "allEqualOrAboveAvg": 0, "atLeastOneBellowAvg": 0}');

INSERT INTO public.notifications (id, config_id, user_id, status, title, message, sub_message, created_at, sent_at, viewed_at, discarded_at) VALUES (nextval('notification_id_seq'), 2, 3, 'SENT', 'new contract AA1 created', 'Your contract AA1 has been created', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL);
INSERT INTO public.notifications (id, config_id, user_id, status, title, message, sub_message, created_at, sent_at, viewed_at, discarded_at) VALUES (nextval('notification_id_seq'), 2, 2, 'SENT', 'new contract AB2 created', 'Your contract AB2 has been created', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL);
INSERT INTO public.notifications (id, config_id, user_id, status, title, message, sub_message, created_at, sent_at, viewed_at, discarded_at) VALUES (nextval('notification_id_seq'), 6, 1, 'CREATED', 'new contract FFFFF created', 'Your contract FFFFF has been created', NULL, CURRENT_TIMESTAMP, NULL, NULL, NULL);

insert into public.lta_isps (id, lta_id, isp_id, created_at, updated_at) 
select nextval('lta_isps_id_seq'), lt.id as lta_id, i.id as isp_id, CURRENT_TIMESTAMP, null
from countries c
inner join ltas lt
on lt.country_id = c.id
inner join isps i
on i.country_id = c.id;

-- HELP_REQUEST_VALUES MOCK DATA
INSERT INTO public.help_request_values (id, code, option) VALUES (nextval('help_request_values_id_seq'), 'bug', ARRAY ['display','behavior']);
INSERT INTO public.help_request_values (id, code, option) VALUES (nextval('help_request_values_id_seq'), 'feedback', ARRAY ['improvement','new_feature']);
INSERT INTO public.help_request_values (id, code, option) VALUES (nextval('help_request_values_id_seq'), 'other', ARRAY ['improvement','new_feature', 'display','behavior']);

-- FUNCTIONALITIES
INSERT INTO public.functionalities  (id, "name" , code) VALUES (nextval('functionalities_id_seq'), 'Login', 'login');
INSERT INTO public.functionalities  (id, "name" , code) VALUES (nextval('functionalities_id_seq'), 'Register', 'register');
INSERT INTO public.functionalities  (id, "name" , code) VALUES (nextval('functionalities_id_seq'), 'Dashboard', 'dashboard');
INSERT INTO public.functionalities  (id, "name" , code) VALUES (nextval('functionalities_id_seq'), 'Profile', 'user_profile');
INSERT INTO public.functionalities  (id, "name" , code) VALUES (nextval('functionalities_id_seq'), 'Account Settings', 'user_settings');
INSERT INTO public.functionalities  (id, "name" , code) VALUES (nextval('functionalities_id_seq'), 'Contract Creation', 'contract_creation');
INSERT INTO public.functionalities  (id, "name" , code) VALUES (nextval('functionalities_id_seq'), 'View Contract', 'contract_viewing');
INSERT INTO public.functionalities  (id, "name" , code) VALUES (nextval('functionalities_id_seq'), 'Payment Creation', 'payment_creation');
INSERT INTO public.functionalities  (id, "name" , code) VALUES (nextval('functionalities_id_seq'), 'Payment Viewing', 'payment_viewing');
INSERT INTO public.functionalities  (id, "name" , code) VALUES (nextval('functionalities_id_seq'), 'Connectivity Viewing', 'connectivity_viewing');
INSERT INTO public.functionalities  (id, "name" , code) VALUES (nextval('functionalities_id_seq'), 'Other', 'other');

-- HELP REQUESTS MOCK DATA
INSERT INTO public.help_requests (id, code, functionality , "type" , description , user_id , created_at, updated_at) VALUES (nextval('help_requests_id_seq'), 'bug', 'login', 'display', 'Not show well', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO public.help_requests (id, code, functionality , "type" , description , user_id , created_at, updated_at) VALUES (nextval('help_requests_id_seq'), 'feedback', 'login', 'display', 'New feature', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- NEW MEASURES DATA
insert into public.measures (id, metric_id, value, school_id, created_at, contract_id) values(nextval('measures_id_seq'), 1, 3, 1, '2023-06-29 13:47:55.610 -0600', 1);
insert into public.measures (id, metric_id, value, school_id, created_at, contract_id) values(nextval('measures_id_seq'), 2, 3, 1, '2023-06-29 13:47:55.610 -0600', 1);
insert into public.measures (id, metric_id, value, school_id, created_at, contract_id) values(nextval('measures_id_seq'), 3, 3, 1, '2023-06-29 13:47:55.610 -0600', 1);
insert into public.measures (id, metric_id, value, school_id, created_at, contract_id) values(nextval('measures_id_seq'), 4, 3, 1, '2023-06-29 13:47:55.610 -0600', 1);
insert into public.measures (id, metric_id, value, school_id, created_at, contract_id) values(nextval('measures_id_seq'), 1, 3, 1, '2023-06-30 13:47:55.610 -0600', 1);
insert into public.measures (id, metric_id, value, school_id, created_at, contract_id) values(nextval('measures_id_seq'), 2, 3, 1, '2023-06-30 13:47:55.610 -0600', 1);
insert into public.measures (id, metric_id, value, school_id, created_at, contract_id) values(nextval('measures_id_seq'), 3, 3, 1, '2023-06-30 13:47:55.610 -0600', 1);
insert into public.measures (id, metric_id, value, school_id, created_at, contract_id) values(nextval('measures_id_seq'), 4, 3, 1, '2023-06-30 13:47:55.610 -0600', 1);
insert into public.measures (id, metric_id, value, school_id, created_at, contract_id) values(nextval('measures_id_seq'), 1, 3, 1, '2023-07-29 13:47:55.610 -0600', 1);
insert into public.measures (id, metric_id, value, school_id, created_at, contract_id) values(nextval('measures_id_seq'), 2, 3, 1, '2023-07-29 13:47:55.610 -0600', 1);
insert into public.measures (id, metric_id, value, school_id, created_at, contract_id) values(nextval('measures_id_seq'), 3, 3, 1, '2023-07-29 13:47:55.610 -0600', 1);
insert into public.measures (id, metric_id, value, school_id, created_at, contract_id) values(nextval('measures_id_seq'), 4, 3, 1, '2023-07-29 13:47:55.610 -0600', 1);
insert into public.measures (id, metric_id, value, school_id, created_at, contract_id) values(nextval('measures_id_seq'), 1, 3, 1, '2023-07-30 13:47:55.610 -0600', 1);
insert into public.measures (id, metric_id, value, school_id, created_at, contract_id) values(nextval('measures_id_seq'), 2, 3, 1, '2023-07-30 13:47:55.610 -0600', 1);
insert into public.measures (id, metric_id, value, school_id, created_at, contract_id) values(nextval('measures_id_seq'), 3, 3, 1, '2023-07-30 13:47:55.610 -0600', 1);
insert into public.measures (id, metric_id, value, school_id, created_at, contract_id) values(nextval('measures_id_seq'), 4, 3, 1, '2023-07-30 13:47:55.610 -0600', 1);

-- BLOCKCHAIN-TRANSACTIONS
insert into blockchain_transactions (id, user_id, contract_id, wallet_address, network_id, network_name, transaction_type, transaction_hash, status, created_at)
values (nextval('blockchain_transactions_id_seq'), (select id from users where email = 'admin@giga.com'), (select min(id) from contracts), '0x35dad65F60c1A32c9895BE97f6bcE57D32792E83', 80001, 'Polygon Mumbai', 'FUND_CONTRACT', '0x690a6810c1aec22b88869ebdbf65ecdae04abad926dcf7714598f09e4b75366a', 1, CURRENT_TIMESTAMP);
