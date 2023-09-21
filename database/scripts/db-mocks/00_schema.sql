CREATE TABLE adonis_schema (
  id integer NOT NULL,
  name character varying(255) NOT NULL,
  batch integer NOT NULL,
  migration_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE adonis_schema_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE adonis_schema_id_seq OWNED BY adonis_schema.id;

CREATE TABLE adonis_schema_versions (version integer NOT NULL);

CREATE TABLE api_tokens (
  id integer NOT NULL,
  user_id integer,
  name character varying(255) NOT NULL,
  type character varying(255) NOT NULL,
  token character varying(64) NOT NULL,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE api_tokens_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE api_tokens_id_seq OWNED BY api_tokens.id;

CREATE TYPE notification_channel AS ENUM ('PUSH', 'EMAIL', 'API');

CREATE TYPE notification_status AS ENUM (
  'CREATED',
  'SENT',
  'READ',
  'DELETED',
  'DISCARDED'
);

CREATE TYPE get_sla_status_by_contract_type AS (
  contractId integer,
  contractName text,
  schoolId integer,
  schoolName text,
  createdAt timestamp,
  contract_Uptime real,
  contract_Latency real,
  contract_DSpeed real,
  contract_USeepd real,
  school_Uptime real,
  school_Latency real,
  school_DSpeed real,
  school_USpeed real,
  sla_Uptime_Status text,
  sla_Latency_Status text,
  sla_DSpeed_Status text,
  sla_USeepd_Status text,
  sla_All_Status text
);

CREATE TABLE attachments (
  id bigint NOT NULL,
  url character varying(255),
  ipfs_url character varying(255),
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  name character varying(255) NOT NULL
);

-- Name: attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE attachments_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE attachments_id_seq OWNED BY attachments.id;

-- Name: contract_attachments; Type: TABLE; Schema: public; Owner: -
CREATE TABLE contract_attachments (
  id bigint NOT NULL,
  contract_id bigint NOT NULL,
  attachment_id bigint NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

-- Name: contract_attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE contract_attachments_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: contract_attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE contract_attachments_id_seq OWNED BY contract_attachments.id;

-- Name: contract_external_contacts; Type: TABLE; Schema: public; Owner: -
CREATE TABLE contract_external_contacts (
  id bigint NOT NULL,
  contract_id bigint NOT NULL,
  external_contact_id bigint NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

-- Name: contract_external_contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE contract_external_contacts_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: contract_external_contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE contract_external_contacts_id_seq OWNED BY contract_external_contacts.id;

-- Name: contracts; Type: TABLE; Schema: public; Owner: -
CREATE TABLE contracts (
  id bigint NOT NULL,
  country_id bigint,
  government_behalf boolean DEFAULT false,
  automatic BOOLEAN NOT NULL DEFAULT false,
  name character varying(255),
  lta_id bigint,
  currency_id bigint NOT NULL,
  budget decimal(20, 2) NOT NULL,
  frequency_id integer NOT NULL,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  launch_date timestamp with time zone NOT NULL,
  isp_id bigint NOT NULL,
  created_by bigint NOT NULL,
  status integer NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  notes character varying(5000) NULL,
  breaking_rules character varying(5000) NULL,
  sign_request_string character varying(255),
  signed_with_wallet boolean default false,
  signed_wallet_address character varying(255),
  payment_receiver_id bigint,
  cashback real null default 0,
  cashback_verified boolean not null default false
);

-- Name: contracts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE contracts_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: contracts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE contracts_id_seq OWNED BY contracts.id;

-- Name: countries; Type: TABLE; Schema: public; Owner: -
CREATE TABLE countries (
  id bigint NOT NULL,
  name character varying(255) NOT NULL,
  code character varying(255) NOT NULL,
  flag_url character varying(255),
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  preferred_language character varying(10) DEFAULT 'EN' :: character varying NOT NULL
);

-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE countries_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE countries_id_seq OWNED BY countries.id;

-- Name: currencies; Type: TABLE; Schema: public; Owner: -
CREATE TABLE currencies (
  id bigint NOT NULL,
  code character varying(255) DEFAULT '' :: character varying,
  name character varying(255),
  type integer not null default 1,
  contract_address character varying(256) null,
  network_id integer null,
  enabled boolean not null default true,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

-- Name: currencies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE currencies_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: currencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE currencies_id_seq OWNED BY currencies.id;

-- Name: draft_external_contacts; Type: TABLE; Schema: public; Owner: -
CREATE TABLE draft_external_contacts (
  id bigint NOT NULL,
  draft_id bigint NOT NULL,
  external_contact_id bigint NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

-- Name: draft_external_contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE draft_external_contacts_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: draft_external_contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE draft_external_contacts_id_seq OWNED BY draft_external_contacts.id;

-- Name: draft_attachments; Type: TABLE; Schema: public; Owner: -
CREATE TABLE draft_attachments (
  id bigint NOT NULL,
  draft_id bigint NOT NULL,
  attachment_id bigint NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

-- Name: draft_attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE draft_attachments_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: draft_attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE draft_attachments_id_seq OWNED BY draft_attachments.id;

-- Name: drafts; Type: TABLE; Schema: public; Owner: -
CREATE TABLE drafts (
  id bigint NOT NULL,
  country_id bigint,
  government_behalf boolean DEFAULT false,
  automatic BOOLEAN NOT NULL DEFAULT false,
  name character varying(255) NOT NULL,
  lta_id bigint,
  currency_id bigint,
  budget decimal(20, 2) NOT NULL,
  frequency_id integer,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  launch_date timestamp with time zone,
  isp_id bigint,
  created_by bigint,
  schools jsonb,
  expected_metrics jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  notes character varying(5000) NULL,
  breaking_rules character varying(5000) NULL,
  payment_receiver_id bigint
);

-- Name: drafts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE drafts_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: drafts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE drafts_id_seq OWNED BY drafts.id;

-- Name: draft_isp_contacts; Type: TABLE; Schema: public; Owner: -
CREATE TABLE draft_isp_contacts (
  id bigint NOT NULL,
  draft_id bigint NOT NULL,
  user_id bigint NOT NULL,
  created_at timestamp with time zone
);

-- Name: draft_isp_contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE draft_isp_contacts_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: draft_isp_contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE draft_isp_contacts_id_seq OWNED BY draft_isp_contacts.id;

-- Name: contract_isp_contacts; Type: TABLE; Schema: public; Owner: -
CREATE TABLE contract_isp_contacts (
  id bigint NOT NULL,
  contract_id bigint NOT NULL,
  user_id bigint NOT NULL,
  created_at timestamp with time zone
);

-- Name: contract_isp_contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE contract_isp_contacts_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: contract_isp_contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE contract_isp_contacts_id_seq OWNED BY contract_isp_contacts.id;

-- Name: draft_stakeholders; Type: TABLE; Schema: public; Owner: -
CREATE TABLE draft_stakeholders (
  id bigint NOT NULL,
  draft_id bigint NOT NULL,
  user_id bigint NOT NULL,
  created_at timestamp with time zone
);

-- Name: draft_stakeholders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE draft_stakeholders_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: draft_stakeholders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE draft_stakeholders_id_seq OWNED BY draft_stakeholders.id;

-- Name: contract_stakeholders; Type: TABLE; Schema: public; Owner: -
CREATE TABLE contract_stakeholders (
  id bigint NOT NULL,
  contract_id bigint NOT NULL,
  user_id bigint NOT NULL,
  created_at timestamp with time zone
);

-- Name: contract_stakeholders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE contract_stakeholders_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: contract_stakeholders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE contract_stakeholders_id_seq OWNED BY contract_stakeholders.id;

-- Name: expected_metrics; Type: TABLE; Schema: public; Owner: -
CREATE TABLE expected_metrics (
  id bigint NOT NULL,
  contract_id bigint NOT NULL,
  metric_id bigint NOT NULL,
  value real,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

-- Name: expected_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE expected_metrics_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: expected_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE expected_metrics_id_seq OWNED BY expected_metrics.id;

-- Name: external_contacts; Type: TABLE; Schema: public; Owner: -
CREATE TABLE external_contacts (
  id bigint NOT NULL,
  isp_id bigint NOT NULL,
  country_id bigint NOT NULL,
  name character varying(255) NOT NULL,
  email character varying(255) NOT NULL,
  phone_number character varying(255) NOT NULL
);

-- Name: external_contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE external_contacts_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: external_contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE external_contacts_id_seq OWNED BY external_contacts.id;

-- Name: frequencies; Type: TABLE; Schema: public; Owner: -
CREATE TABLE frequencies (
  id integer NOT NULL,
  name character varying(255),
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

-- Name: frequencies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE frequencies_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: frequencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE frequencies_id_seq OWNED BY frequencies.id;

-- Name: help_requests; Type: TABLE; Schema: public; Owner: -
CREATE TABLE help_requests (
  id bigint NOT NULL,
  type character varying(255),
  description character varying(1000),
  path character varying(255) NOT NULL,
  user_id bigint NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

-- Name: help_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE help_requests_id_seq AS bigint START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: help_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE help_requests_id_seq OWNED BY help_requests.id;

-- Name: help_request_values; Type: TABLE; Schema: public; Owner: -
CREATE TABLE help_request_values (
  id bigint NOT NULL,
  code character varying(255) PRIMARY KEY,
  option text []
);

-- Name: help_request_values_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE help_request_values_id_seq AS bigint START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: help_request_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE help_request_values_id_seq OWNED BY help_request_values.id;

-- Name: functionalities; Type: TABLE; Schema: public; Owner: -
CREATE TABLE functionalities (
  id bigint NOT NULL,
  name character varying(255),
  code character varying(255) PRIMARY KEY
);

-- Name: functionalities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE functionalities_id_seq AS bigint START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: functionalities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE functionalities_id_seq OWNED BY functionalities.id;

-- Name: feedbacks; Type: TABLE; Schema: public; Owner: -
CREATE TABLE feedbacks (
  id bigint NOT NULL,
  rate bigint NOT NULL,
  comment character varying(1000),
  path character varying(255) NOT NULL,
  created_at timestamp with time zone
);

-- Name: feedbacks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE feedbacks_id_seq AS bigint START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: feedbacks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE feedbacks_id_seq OWNED BY feedbacks.id;

-- Name: isp_users; Type: TABLE; Schema: public; Owner: -
CREATE TABLE isp_users (
  id bigint NOT NULL,
  user_id bigint NOT NULL,
  isp_id bigint NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

-- Name: isp_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE isp_users_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: isp_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE isp_users_id_seq OWNED BY isp_users.id;

-- Name: isps; Type: TABLE; Schema: public; Owner: -
CREATE TABLE isps (
  id bigint NOT NULL,
  name character varying(255),
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  country_id bigint
);

-- Name: isps_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE isps_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: isps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE isps_id_seq OWNED BY isps.id;

-- Name: lta_isps; Type: TABLE; Schema: public; Owner: -
CREATE TABLE lta_isps (
  id bigint NOT NULL,
  lta_id bigint NOT NULL,
  isp_id bigint NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

-- Name: lta_isps_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE lta_isps_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: lta_isps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE lta_isps_id_seq OWNED BY lta_isps.id;

-- Name: ltas; Type: TABLE; Schema: public; Owner: -
CREATE TABLE ltas (
  id bigint NOT NULL,
  name character varying(255) NOT NULL,
  created_by bigint,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  country_id bigint
);

-- Name: ltas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE ltas_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: ltas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE ltas_id_seq OWNED BY ltas.id;

-- Name: measures; Type: TABLE; Schema: public; Owner: -
CREATE TABLE measures (
  id bigint NOT NULL,
  metric_id integer NOT NULL,
  value real,
  school_id integer NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  contract_id bigint NOT NULL
);

-- Name: measures_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE measures_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: measures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE measures_id_seq OWNED BY measures.id;

-- Name: metrics; Type: TABLE; Schema: public; Owner: -
CREATE TABLE metrics (
  id integer NOT NULL,
  code character varying(20) NOT NULL DEFAULT '',
  name character varying(255),
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  unit character varying(255) DEFAULT '' :: character varying NOT NULL,
  weight integer DEFAULT 0 NOT NULL
);

-- Name: metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE metrics_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE metrics_id_seq OWNED BY metrics.id;

-- Name: users; Type: TABLE; Schema: public; Owner: -
CREATE TABLE users (
  id bigint NOT NULL,
  name character varying(255) NOT NULL,
  last_name character varying(255) DEFAULT '' :: character varying NOT NULL,
  email character varying(255) NOT NULL,
  password character varying(255) NOT NULL,
  phone_number character varying(200) NOT NULL,
  zip_code character varying(10) NOT NULL,
  photo_url character varying(500) NOT NULL,
  address character varying(200) NOT NULL,
  about character varying(5000) NOT NULL,
  country_id bigint,
  safe_id bigint,
  wallet_address character varying(255),
  wallet_request_string character varying(255),
  default_language character varying(2) DEFAULT 'EN' :: character varying,
  automatic_contracts_enabled boolean NOT NULL default false,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

-- Name: notification_configurations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE notification_configurations_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: notification_configurations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE notification_configurations_id_seq OWNED BY users.id;

-- Name: notification_configurations; Type: TABLE; Schema: public; Owner: -
CREATE TABLE notification_configurations (
  id bigint DEFAULT nextval('notification_configurations_id_seq' :: regclass) NOT NULL,
  source_id integer NOT NULL,
  role_id integer NOT NULL,
  channel notification_channel NOT NULL,
  locked_for_user boolean DEFAULT false,
  read_only boolean DEFAULT false,
  priority integer not null default 0,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone
);

-- Name: notifications; Type: TABLE; Schema: public; Owner: -
CREATE TABLE notifications (
  id bigint NOT NULL,
  config_id integer NOT NULL,
  user_id integer NOT NULL,
  status notification_status NOT NULL,
  title character varying(255),
  message text NOT NULL,
  sub_message text,
  email character varying(200) NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  sent_at timestamp with time zone,
  viewed_at timestamp with time zone,
  discarded_at timestamp with time zone
);

-- Name: notification_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE notification_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE notification_id_seq OWNED BY notifications.id;

-- Name: notification_messages; Type: TABLE; Schema: public; Owner: -
CREATE TABLE notification_messages (
  id bigint NOT NULL,
  notification_config_id integer NOT NULL,
  preferred_language character varying(10) NOT NULL,
  title character varying(255),
  message text NOT NULL,
  sub_message text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone
);

-- Name: notification_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE notification_messages_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: notification_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE notification_messages_id_seq OWNED BY notification_messages.id;

-- Name: notification_sources; Type: TABLE; Schema: public; Owner: -
CREATE TABLE notification_sources (
  id bigint NOT NULL,
  code character varying(7) NOT NULL,
  name character varying(50) NOT NULL,
  description character varying(255),
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone
);

-- Name: notification_source_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE notification_source_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: notification_source_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE notification_source_id_seq OWNED BY notification_sources.id;

-- Name: payments; Type: TABLE; Schema: public; Owner: -
CREATE TABLE payments (
  id bigint NOT NULL,
  date_from timestamp with time zone NOT NULL,
  date_to timestamp with time zone NOT NULL,
  invoice_id bigint,
  receipt_id bigint,
  is_verified boolean DEFAULT false,
  contract_id bigint NOT NULL,
  paid_by bigint,
  amount decimal(20, 2) NOT NULL default 0,
  discount decimal(20, 2) NOT NULL default 0,
  currency_id bigint,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  description character varying(255),
  status integer DEFAULT 0 NOT NULL,
  created_by bigint NOT NULL,
  metrics jsonb
);

-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE payments_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE payments_id_seq OWNED BY payments.id;

-- Name: permissions; Type: TABLE; Schema: public; Owner: -
CREATE TABLE permissions (
  id bigint NOT NULL,
  name character varying(255) NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE permissions_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE permissions_id_seq OWNED BY permissions.id;

-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
CREATE TABLE role_permissions (
  id bigint NOT NULL,
  role_id bigint NOT NULL,
  permission_id bigint NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

-- Name: role_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE role_permissions_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: role_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE role_permissions_id_seq OWNED BY role_permissions.id;

-- Name: roles; Type: TABLE; Schema: public; Owner: -
CREATE TABLE roles (
  id bigint NOT NULL,
  code character varying(40) NOT NULL,
  name character varying(255) NOT NULL,
  internal_use boolean DEFAULT false,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE roles_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE roles_id_seq OWNED BY roles.id;

-- Name: safes; Type: TABLE; Schema: public; Owner: -
CREATE TABLE safes (
  id bigint NOT NULL,
  address character varying(255) NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  name character varying(255) NOT NULL
);

-- Name: safes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE safes_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: safes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE safes_id_seq OWNED BY safes.id;

-- Name: school_contracts; Type: TABLE; Schema: public; Owner: -
CREATE TABLE school_contracts (
  id bigint NOT NULL,
  school_id bigint NOT NULL,
  contract_id bigint NOT NULL,
  budget decimal(20, 2) NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

-- Name: school_contracts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE school_contracts_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: school_contracts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE school_contracts_id_seq OWNED BY school_contracts.id;

-- Name: schools; Type: TABLE; Schema: public; Owner: -
CREATE TABLE schools (
  id bigint NOT NULL,
  external_id character varying(255),
  name character varying(255) NOT NULL,
  address character varying(255) NOT NULL,
  location_1 character varying(255),
  location_2 character varying(255),
  location_3 character varying(255),
  location_4 character varying(255),
  education_level character varying(255) NOT NULL,
  geopoint character varying(255),
  email character varying(255),
  phone_number character varying(255),
  contact_person character varying(255),
  country_id bigint NOT NULL,
  reliable_measures boolean not null default false,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  giga_id_school character varying(255)
);

-- Name: schools_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE schools_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE schools_id_seq OWNED BY schools.id;

-- Name: status_transitions; Type: TABLE; Schema: public; Owner: -
CREATE TABLE status_transitions (
  id integer NOT NULL,
  who bigint,
  contract_id bigint,
  initial_status integer NOT NULL,
  final_status integer NOT NULL,
  "when" timestamp with time zone,
  updated_at timestamp with time zone,
  data jsonb
);

-- Name: status_transitions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE status_transitions_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: status_transitions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE status_transitions_id_seq OWNED BY status_transitions.id;

-- Name: suggested_metrics; Type: TABLE; Schema: public; Owner: -
CREATE TABLE suggested_metrics (
  id bigint NOT NULL,
  metric_id bigint NOT NULL,
  value character varying(255) NOT NULL,
  unit character varying(255) NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

-- Name: suggested_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE suggested_metrics_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: suggested_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE suggested_metrics_id_seq OWNED BY suggested_metrics.id;

-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
CREATE TABLE user_roles (
  id bigint NOT NULL,
  user_id bigint NOT NULL,
  role_id bigint NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE logs (
  type character varying(100),
  description character varying(5000)
);

-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE user_roles_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE user_roles_id_seq OWNED BY user_roles.id;

-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE users_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE users_id_seq OWNED BY users.id;

-- Name: adonis_schema id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY adonis_schema
ALTER COLUMN
  id
SET
  DEFAULT nextval('adonis_schema_id_seq' :: regclass);

-- Name: api_tokens id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY api_tokens
ALTER COLUMN
  id
SET
  DEFAULT nextval('api_tokens_id_seq' :: regclass);

-- Name: attachments id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY attachments
ALTER COLUMN
  id
SET
  DEFAULT nextval('attachments_id_seq' :: regclass);

-- Name: contract_attachments id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_attachments
ALTER COLUMN
  id
SET
  DEFAULT nextval('contract_attachments_id_seq' :: regclass);

-- Name: contract_external_contacts id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_external_contacts
ALTER COLUMN
  id
SET
  DEFAULT nextval('contract_external_contacts_id_seq' :: regclass);

-- Name: contracts id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY contracts
ALTER COLUMN
  id
SET
  DEFAULT nextval('contracts_id_seq' :: regclass);

-- Name: countries id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY countries
ALTER COLUMN
  id
SET
  DEFAULT nextval('countries_id_seq' :: regclass);

-- Name: currencies id; Type: DEFAULT; Schema: public; Owner: -
alter table
  ONLY currencies
add
  constraint currencies_code_network_unique unique(code, network_id);

ALTER TABLE
  ONLY currencies
ALTER COLUMN
  id
SET
  DEFAULT nextval('currencies_id_seq' :: regclass);

-- Name: draft_external_contacts id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_external_contacts
ALTER COLUMN
  id
SET
  DEFAULT nextval('draft_external_contacts_id_seq' :: regclass);

-- Name: draft_attachments id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_attachments
ALTER COLUMN
  id
SET
  DEFAULT nextval('draft_attachments_id_seq' :: regclass);

-- Name: drafts id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY drafts
ALTER COLUMN
  id
SET
  DEFAULT nextval('drafts_id_seq' :: regclass);

-- Name: draft_isp_contacts id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_isp_contacts
ALTER COLUMN
  id
SET
  DEFAULT nextval('draft_isp_contacts_id_seq' :: regclass);

-- Name: contract_isp_contacts id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_isp_contacts
ALTER COLUMN
  id
SET
  DEFAULT nextval('contract_isp_contacts_id_seq' :: regclass);

-- Name: draft_stakeholders id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_stakeholders
ALTER COLUMN
  id
SET
  DEFAULT nextval('draft_stakeholders_id_seq' :: regclass);

-- Name: contract_stakeholders id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_stakeholders
ALTER COLUMN
  id
SET
  DEFAULT nextval('contract_stakeholders_id_seq' :: regclass);

-- Name: expected_metrics id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY expected_metrics
ALTER COLUMN
  id
SET
  DEFAULT nextval('expected_metrics_id_seq' :: regclass);

-- Name: external_contacts id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY external_contacts
ALTER COLUMN
  id
SET
  DEFAULT nextval('external_contacts_id_seq' :: regclass);

-- Name: frequencies id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY frequencies
ALTER COLUMN
  id
SET
  DEFAULT nextval('frequencies_id_seq' :: regclass);

-- Name: help_requests id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY help_requests
ALTER COLUMN
  id
SET
  DEFAULT nextval('help_requests_id_seq' :: regclass);

-- Name: help_request_values id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY help_request_values
ALTER COLUMN
  id
SET
  DEFAULT nextval('help_request_values_id_seq' :: regclass);

-- Name: functionalities id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY functionalities
ALTER COLUMN
  id
SET
  DEFAULT nextval('functionalities_id_seq' :: regclass);

-- Name: feedbacks id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY feedbacks
ALTER COLUMN
  id
SET
  DEFAULT nextval('feedbacks_id_seq' :: regclass);

-- Name: isp_users id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY isp_users
ALTER COLUMN
  id
SET
  DEFAULT nextval('isp_users_id_seq' :: regclass);

-- Name: isps id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY isps
ALTER COLUMN
  id
SET
  DEFAULT nextval('isps_id_seq' :: regclass);

-- Name: lta_isps id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY lta_isps
ALTER COLUMN
  id
SET
  DEFAULT nextval('lta_isps_id_seq' :: regclass);

-- Name: ltas id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY ltas
ALTER COLUMN
  id
SET
  DEFAULT nextval('ltas_id_seq' :: regclass);

-- Name: measures id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY measures
ALTER COLUMN
  id
SET
  DEFAULT nextval('measures_id_seq' :: regclass);

-- Name: metrics id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY metrics
ALTER COLUMN
  id
SET
  DEFAULT nextval('metrics_id_seq' :: regclass);

-- Name: notification_messages id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY notification_messages
ALTER COLUMN
  id
SET
  DEFAULT nextval('notification_messages_id_seq' :: regclass);

-- Name: notification_sources id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY notification_sources
ALTER COLUMN
  id
SET
  DEFAULT nextval('notification_source_id_seq' :: regclass);

-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY notifications
ALTER COLUMN
  id
SET
  DEFAULT nextval('notification_id_seq' :: regclass);

-- Name: payments id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY payments
ALTER COLUMN
  id
SET
  DEFAULT nextval('payments_id_seq' :: regclass);

-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY permissions
ALTER COLUMN
  id
SET
  DEFAULT nextval('permissions_id_seq' :: regclass);

-- Name: role_permissions id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY role_permissions
ALTER COLUMN
  id
SET
  DEFAULT nextval('role_permissions_id_seq' :: regclass);

-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY roles
ALTER COLUMN
  id
SET
  DEFAULT nextval('roles_id_seq' :: regclass);

-- Name: safes id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY safes
ALTER COLUMN
  id
SET
  DEFAULT nextval('safes_id_seq' :: regclass);

-- Name: school_contracts id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY school_contracts
ALTER COLUMN
  id
SET
  DEFAULT nextval('school_contracts_id_seq' :: regclass);

-- Name: schools id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY schools
ALTER COLUMN
  id
SET
  DEFAULT nextval('schools_id_seq' :: regclass);

-- Name: status_transitions id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY status_transitions
ALTER COLUMN
  id
SET
  DEFAULT nextval('status_transitions_id_seq' :: regclass);

-- Name: suggested_metrics id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY suggested_metrics
ALTER COLUMN
  id
SET
  DEFAULT nextval('suggested_metrics_id_seq' :: regclass);

-- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY user_roles
ALTER COLUMN
  id
SET
  DEFAULT nextval('user_roles_id_seq' :: regclass);

-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
ALTER TABLE
  ONLY users
ALTER COLUMN
  id
SET
  DEFAULT nextval('users_id_seq' :: regclass);

-- Name: adonis_schema adonis_schema_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY adonis_schema
ADD
  CONSTRAINT adonis_schema_pkey PRIMARY KEY (id);

-- Name: api_tokens api_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY api_tokens
ADD
  CONSTRAINT api_tokens_pkey PRIMARY KEY (id);

-- Name: api_tokens api_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY api_tokens
ADD
  CONSTRAINT api_tokens_token_unique UNIQUE (token);

-- Name: attachments attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY attachments
ADD
  CONSTRAINT attachments_pkey PRIMARY KEY (id);

-- Name: external_contacts external_contacts_token_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY external_contacts
ADD
  CONSTRAINT external_contacts_token_unique UNIQUE (email);

-- Name: contract_attachments contract_attachments_contract_id_attachment_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_attachments
ADD
  CONSTRAINT contract_attachments_contract_id_attachment_id_unique UNIQUE (contract_id, attachment_id);

-- Name: contract_attachments contract_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_attachments
ADD
  CONSTRAINT contract_attachments_pkey PRIMARY KEY (id);

-- Name: contracts contracts_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contracts
ADD
  CONSTRAINT contracts_name_unique UNIQUE (name);

-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contracts
ADD
  CONSTRAINT contracts_pkey PRIMARY KEY (id);

-- Name: countries countries_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY countries
ADD
  CONSTRAINT countries_name_unique UNIQUE (name);

-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY countries
ADD
  CONSTRAINT countries_pkey PRIMARY KEY (id);

-- Name: currencies currencies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY currencies
ADD
  CONSTRAINT currencies_pkey PRIMARY KEY (id);

-- Name: draft_external_contacts draft_external_contacts_draft_id_external_contact_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_external_contacts
ADD
  CONSTRAINT draft_external_contacts_draft_id_external_contact_id_unique UNIQUE (draft_id, external_contact_id);

-- Name: draft_external_contacts draft_external_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_external_contacts
ADD
  CONSTRAINT draft_external_contacts_pkey PRIMARY KEY (id);

-- Name: draft_attachments draft_attachments_draft_id_attachment_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_attachments
ADD
  CONSTRAINT draft_attachments_draft_id_attachment_id_unique UNIQUE (draft_id, attachment_id);

-- Name: draft_attachments draft_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_attachments
ADD
  CONSTRAINT draft_attachments_pkey PRIMARY KEY (id);

-- Name: drafts drafts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY drafts
ADD
  CONSTRAINT drafts_pkey PRIMARY KEY (id);

-- Name: draft_isp_contacts draft_isp_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_isp_contacts
ADD
  CONSTRAINT draft_isp_contacts_pkey PRIMARY KEY (id);

-- Name: contract_external_contacts contract_external_contacts_contract_id_external_contact_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_external_contacts
ADD
  CONSTRAINT contract_external_contacts_contract_id_external_contact_id_unique UNIQUE (contract_id, external_contact_id);

-- Name: contract_external_contacts contract_external_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_external_contacts
ADD
  CONSTRAINT contract_external_contacts_pkey PRIMARY KEY (id);

-- Name: contract_isp_contacts contract_isp_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_isp_contacts
ADD
  CONSTRAINT contract_isp_contacts_pkey PRIMARY KEY (id);

-- Name: draft_isp_contacts draft_isp_contacts_draft_id_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_isp_contacts
ADD
  CONSTRAINT draft_isp_contacts_draft_id_user_id_unique UNIQUE (draft_id, user_id);

-- Name: contract_isp_contacts contract_isp_contacts_contract_id_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_isp_contacts
ADD
  CONSTRAINT contract_isp_contacts_contract_id_user_id_unique UNIQUE (contract_id, user_id);

-- Name: draft_stakeholders draft_stakeholders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_stakeholders
ADD
  CONSTRAINT draft_stakeholders_pkey PRIMARY KEY (id);

-- Name: contract_stakeholders contract_stakeholders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_stakeholders
ADD
  CONSTRAINT contract_stakeholders_pkey PRIMARY KEY (id);

-- Name: draft_stakeholders draft_stakeholders_draft_id_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_stakeholders
ADD
  CONSTRAINT draft_stakeholders_draft_id_user_id_unique UNIQUE (draft_id, user_id);

-- Name: contract_stakeholders contract_stakeholders_contract_id_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_stakeholders
ADD
  CONSTRAINT contract_stakeholders_contract_id_user_id_unique UNIQUE (contract_id, user_id);

-- Name: external_contacts external_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY external_contacts
ADD
  CONSTRAINT external_contacts_pkey PRIMARY KEY (id);

-- Name: expected_metrics expected_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY expected_metrics
ADD
  CONSTRAINT expected_metrics_pkey PRIMARY KEY (id);

-- Name: frequencies frequencies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY frequencies
ADD
  CONSTRAINT frequencies_pkey PRIMARY KEY (id);

-- Name: isp_users isp_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY isp_users
ADD
  CONSTRAINT isp_users_pkey PRIMARY KEY (id);

-- Name: isp_users isp_users_user_id_isp_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY isp_users
ADD
  CONSTRAINT isp_users_user_id_isp_id_unique UNIQUE (user_id, isp_id);

-- Name: isps isps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY isps
ADD
  CONSTRAINT isps_pkey PRIMARY KEY (id);

-- Name: lta_isps lta_isps_lta_id_isp_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY lta_isps
ADD
  CONSTRAINT lta_isps_lta_id_isp_id_unique UNIQUE (lta_id, isp_id);

-- Name: lta_isps lta_isps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY lta_isps
ADD
  CONSTRAINT lta_isps_pkey PRIMARY KEY (id);

-- Name: ltas ltas_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY ltas
ADD
  CONSTRAINT ltas_name_unique UNIQUE (name);

-- Name: ltas ltas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY ltas
ADD
  CONSTRAINT ltas_pkey PRIMARY KEY (id);

-- Name: measures measures_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY measures
ADD
  CONSTRAINT measures_pkey PRIMARY KEY (id);

-- Name: metrics metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY metrics
ADD
  CONSTRAINT metrics_pkey PRIMARY KEY (id);

-- Name: notification_messages notification_config_id_preferred_lang_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY notification_messages
ADD
  CONSTRAINT notification_config_id_preferred_lang_unique UNIQUE (notification_config_id, preferred_language);

-- Name: notification_configurations notification_configuration_source_id_role_id_channel_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY notification_configurations
ADD
  CONSTRAINT notification_configuration_source_id_role_id_channel_unique UNIQUE (source_id, role_id, channel);

-- Name: notification_configurations notification_configurations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY notification_configurations
ADD
  CONSTRAINT notification_configurations_pkey PRIMARY KEY (id);

-- Name: notification_messages notification_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY notification_messages
ADD
  CONSTRAINT notification_messages_pkey PRIMARY KEY (id);

-- Name: notifications notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY notifications
ADD
  CONSTRAINT notification_pkey PRIMARY KEY (id);

-- Name: notification_sources notification_source_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY notification_sources
ADD
  CONSTRAINT notification_source_pkey PRIMARY KEY (id);

-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY payments
ADD
  CONSTRAINT payments_pkey PRIMARY KEY (id);

-- Name: permissions permissions_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY permissions
ADD
  CONSTRAINT permissions_name_unique UNIQUE (name);

-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY permissions
ADD
  CONSTRAINT permissions_pkey PRIMARY KEY (id);

-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY role_permissions
ADD
  CONSTRAINT role_permissions_pkey PRIMARY KEY (id);

-- Name: role_permissions role_permissions_role_id_permission_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY role_permissions
ADD
  CONSTRAINT role_permissions_role_id_permission_id_unique UNIQUE (role_id, permission_id);

-- Name: roles roles_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY roles
ADD
  CONSTRAINT roles_name_unique UNIQUE (name);

-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY roles
ADD
  CONSTRAINT roles_pkey PRIMARY KEY (id);

-- Name: safes safes_address_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY safes
ADD
  CONSTRAINT safes_address_unique UNIQUE (address);

-- Name: safes safes_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY safes
ADD
  CONSTRAINT safes_name_unique UNIQUE (name);

-- Name: safes safes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY safes
ADD
  CONSTRAINT safes_pkey PRIMARY KEY (id);

-- Name: school_contracts school_contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY school_contracts
ADD
  CONSTRAINT school_contracts_pkey PRIMARY KEY (id);

-- Name: school_contracts school_contracts_school_id_contract_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY school_contracts
ADD
  CONSTRAINT school_contracts_school_id_contract_id_unique UNIQUE (school_id, contract_id);

-- Name: schools schools_external_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY schools
ADD
  CONSTRAINT schools_external_id_unique UNIQUE (external_id);

-- Name: schools schools_giga_id_school_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY schools
ADD
  CONSTRAINT schools_giga_id_school_unique UNIQUE (giga_id_school);

-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY schools
ADD
  CONSTRAINT schools_pkey PRIMARY KEY (id);

-- Name: status_transitions status_transitions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY status_transitions
ADD
  CONSTRAINT status_transitions_pkey PRIMARY KEY (id);

-- Name: suggested_metrics suggested_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY suggested_metrics
ADD
  CONSTRAINT suggested_metrics_pkey PRIMARY KEY (id);

-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY user_roles
ADD
  CONSTRAINT user_roles_pkey PRIMARY KEY (id);

-- Name: user_roles user_roles_user_id_role_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY user_roles
ADD
  CONSTRAINT user_roles_user_id_role_id_unique UNIQUE (user_id, role_id);

-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY users
ADD
  CONSTRAINT users_email_unique UNIQUE (email);

-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY users
ADD
  CONSTRAINT users_pkey PRIMARY KEY (id);

-- Name: users users_wallet_address_unique; Type: CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY users
ADD
  CONSTRAINT users_wallet_address_unique UNIQUE (wallet_address);

-- Name: api_tokens api_tokens_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY api_tokens
ADD
  CONSTRAINT api_tokens_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Name: contract_external_contacts contract_external_contacts_external_contact_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_external_contacts
ADD
  CONSTRAINT contract_external_contacts_external_contact_id_foreign FOREIGN KEY (external_contact_id) REFERENCES external_contacts(id);

-- Name: contract_external_contacts contract_external_contacts_contract_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_external_contacts
ADD
  CONSTRAINT contract_external_contacts_contract_id_foreign FOREIGN KEY (contract_id) REFERENCES contracts(id);

-- Name: contract_attachments contract_attachments_attachment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_attachments
ADD
  CONSTRAINT contract_attachments_attachment_id_foreign FOREIGN KEY (attachment_id) REFERENCES attachments(id);

-- Name: contract_attachments contract_attachments_contract_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_attachments
ADD
  CONSTRAINT contract_attachments_contract_id_foreign FOREIGN KEY (contract_id) REFERENCES contracts(id);

-- Name: contracts contracts_country_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contracts
ADD
  CONSTRAINT contracts_country_id_foreign FOREIGN KEY (country_id) REFERENCES countries(id);

-- Name: contracts contracts_created_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contracts
ADD
  CONSTRAINT contracts_created_by_foreign FOREIGN KEY (created_by) REFERENCES users(id);

-- Name: contracts contracts_currency_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contracts
ADD
  CONSTRAINT contracts_currency_id_foreign FOREIGN KEY (currency_id) REFERENCES currencies(id);

-- Name: contracts contracts_frequency_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contracts
ADD
  CONSTRAINT contracts_frequency_id_foreign FOREIGN KEY (frequency_id) REFERENCES frequencies(id);

-- Name: contracts contracts_isp_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contracts
ADD
  CONSTRAINT contracts_isp_id_foreign FOREIGN KEY (isp_id) REFERENCES isps(id);

-- Name: contracts contracts_lta_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contracts
ADD
  CONSTRAINT contracts_lta_id_foreign FOREIGN KEY (lta_id) REFERENCES ltas(id);

-- Name: contracts contracts_payment_receiver_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contracts
ADD
  CONSTRAINT contracts_payment_receiver_id_foreign FOREIGN KEY (payment_receiver_id) REFERENCES users(id);

-- Name: draft_external_contacts draft_external_contacts_external_contact_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_external_contacts
ADD
  CONSTRAINT draft_external_contacts_external_contact_id_foreign FOREIGN KEY (external_contact_id) REFERENCES external_contacts(id);

-- Name: draft_external_contacts draft_external_contacts_draft_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_external_contacts
ADD
  CONSTRAINT draft_external_contacts_draft_id_foreign FOREIGN KEY (draft_id) REFERENCES drafts(id);

-- Name: drafts drafts_payment_receiver_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY drafts
ADD
  CONSTRAINT drafts_payment_receiver_id_foreign FOREIGN KEY (payment_receiver_id) REFERENCES users(id);

-- Name: draft_attachments draft_attachments_attachment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_attachments
ADD
  CONSTRAINT draft_attachments_attachment_id_foreign FOREIGN KEY (attachment_id) REFERENCES attachments(id);

-- Name: draft_attachments draft_attachments_draft_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_attachments
ADD
  CONSTRAINT draft_attachments_draft_id_foreign FOREIGN KEY (draft_id) REFERENCES drafts(id);

-- Name: drafts drafts_country_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY drafts
ADD
  CONSTRAINT drafts_country_id_foreign FOREIGN KEY (country_id) REFERENCES countries(id);

-- Name: drafts drafts_created_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY drafts
ADD
  CONSTRAINT drafts_created_by_foreign FOREIGN KEY (created_by) REFERENCES users(id);

-- Name: drafts drafts_currency_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY drafts
ADD
  CONSTRAINT drafts_currency_id_foreign FOREIGN KEY (currency_id) REFERENCES currencies(id);

-- Name: drafts drafts_frequency_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY drafts
ADD
  CONSTRAINT drafts_frequency_id_foreign FOREIGN KEY (frequency_id) REFERENCES frequencies(id);

-- Name: drafts drafts_isp_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY drafts
ADD
  CONSTRAINT drafts_isp_id_foreign FOREIGN KEY (isp_id) REFERENCES isps(id);

-- Name: drafts drafts_lta_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY drafts
ADD
  CONSTRAINT drafts_lta_id_foreign FOREIGN KEY (lta_id) REFERENCES ltas(id);

-- Name: draft_isp_contacts draft_isp_contacts_draft_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_isp_contacts
ADD
  CONSTRAINT draft_isp_contacts_draft_id_foreign FOREIGN KEY (draft_id) REFERENCES drafts(id);

-- Name: draft_isp_contacts draft_isp_contacts_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_isp_contacts
ADD
  CONSTRAINT draft_isp_contacts_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id);

-- Name: contract_isp_contacts contract_isp_contacts_contract_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_isp_contacts
ADD
  CONSTRAINT contract_isp_contacts_contract_id_foreign FOREIGN KEY (contract_id) REFERENCES contracts(id);

-- Name: contract_isp_contacts contract_isp_contacts_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_isp_contacts
ADD
  CONSTRAINT contract_isp_contacts_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id);

-- Name: draft_stakeholders draft_stakeholders_draft_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_stakeholders
ADD
  CONSTRAINT draft_stakeholders_draft_id_foreign FOREIGN KEY (draft_id) REFERENCES drafts(id);

-- Name: draft_stakeholders draft_stakeholders_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY draft_stakeholders
ADD
  CONSTRAINT draft_stakeholders_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id);

-- Name: contract_stakeholders contract_stakeholders_contract_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_stakeholders
ADD
  CONSTRAINT contract_stakeholders_contract_id_foreign FOREIGN KEY (contract_id) REFERENCES contracts(id);

-- Name: contract_stakeholders contract_stakeholders_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY contract_stakeholders
ADD
  CONSTRAINT contract_stakeholders_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id);

-- Name: external_contacts external_contacts_isp_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY external_contacts
ADD
  CONSTRAINT external_contacts_isp_id_foreign FOREIGN KEY (isp_id) REFERENCES isps(id);

-- Name: external_contacts external_contacts_country_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY external_contacts
ADD
  CONSTRAINT external_contacts_country_id_foreign FOREIGN KEY (country_id) REFERENCES countries(id);

-- Name: help_requests_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY help_requests
ADD
  CONSTRAINT help_requests_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id);

-- Name: expected_metrics expected_metrics_contract_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY expected_metrics
ADD
  CONSTRAINT expected_metrics_contract_id_foreign FOREIGN KEY (contract_id) REFERENCES contracts(id);

-- Name: expected_metrics expected_metrics_metric_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY expected_metrics
ADD
  CONSTRAINT expected_metrics_metric_id_foreign FOREIGN KEY (metric_id) REFERENCES metrics(id);

-- Name: isp_users isp_users_isp_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY isp_users
ADD
  CONSTRAINT isp_users_isp_id_foreign FOREIGN KEY (isp_id) REFERENCES isps(id);

-- Name: isp_users isp_users_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY isp_users
ADD
  CONSTRAINT isp_users_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id);

-- Name: isps isps_country_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY isps
ADD
  CONSTRAINT isps_country_id_foreign FOREIGN KEY (country_id) REFERENCES countries(id);

-- Name: lta_isps lta_isps_isp_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY lta_isps
ADD
  CONSTRAINT lta_isps_isp_id_foreign FOREIGN KEY (isp_id) REFERENCES isps(id);

-- Name: lta_isps lta_isps_lta_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY lta_isps
ADD
  CONSTRAINT lta_isps_lta_id_foreign FOREIGN KEY (lta_id) REFERENCES ltas(id);

-- Name: ltas ltas_country_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY ltas
ADD
  CONSTRAINT ltas_country_id_foreign FOREIGN KEY (country_id) REFERENCES countries(id);

-- Name: ltas ltas_created_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY ltas
ADD
  CONSTRAINT ltas_created_by_foreign FOREIGN KEY (created_by) REFERENCES users(id);

-- Name: measures measures_contract_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY measures
ADD
  CONSTRAINT measures_contract_id_foreign FOREIGN KEY (contract_id) REFERENCES contracts(id);

-- Name: measures measures_metric_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY measures
ADD
  CONSTRAINT measures_metric_id_foreign FOREIGN KEY (metric_id) REFERENCES metrics(id);

-- Name: measures measures_school_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY measures
ADD
  CONSTRAINT measures_school_id_foreign FOREIGN KEY (school_id) REFERENCES schools(id);

-- Name: notifications notification_config_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY notifications
ADD
  CONSTRAINT notification_config_id_fkey FOREIGN KEY (config_id) REFERENCES notification_configurations(id);

-- Name: notification_configurations notification_configurations_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY notification_configurations
ADD
  CONSTRAINT notification_configurations_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id);

-- Name: notification_configurations notification_configurations_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY notification_configurations
ADD
  CONSTRAINT notification_configurations_source_id_fkey FOREIGN KEY (source_id) REFERENCES notification_sources(id);

-- Name: notification_messages notification_messages_notification_config_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY notification_messages
ADD
  CONSTRAINT notification_messages_notification_config_id_fkey FOREIGN KEY (notification_config_id) REFERENCES notification_configurations(id);

-- Name: notifications notification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY notifications
ADD
  CONSTRAINT notification_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);

-- Name: payments payments_contract_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY payments
ADD
  CONSTRAINT payments_contract_id_foreign FOREIGN KEY (contract_id) REFERENCES contracts(id);

-- Name: payments payments_created_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY payments
ADD
  CONSTRAINT payments_created_by_foreign FOREIGN KEY (created_by) REFERENCES users(id);

-- Name: payments payments_currency_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY payments
ADD
  CONSTRAINT payments_currency_id_foreign FOREIGN KEY (currency_id) REFERENCES currencies(id);

-- Name: payments payments_invoice_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY payments
ADD
  CONSTRAINT payments_invoice_id_foreign FOREIGN KEY (invoice_id) REFERENCES attachments(id);

-- Name: payments payments_paid_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY payments
ADD
  CONSTRAINT payments_paid_by_foreign FOREIGN KEY (paid_by) REFERENCES users(id);

-- Name: payments payments_receipt_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY payments
ADD
  CONSTRAINT payments_receipt_id_foreign FOREIGN KEY (receipt_id) REFERENCES attachments(id);

-- Name: role_permissions role_permissions_permission_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY role_permissions
ADD
  CONSTRAINT role_permissions_permission_id_foreign FOREIGN KEY (permission_id) REFERENCES permissions(id);

-- Name: role_permissions role_permissions_role_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY role_permissions
ADD
  CONSTRAINT role_permissions_role_id_foreign FOREIGN KEY (role_id) REFERENCES roles(id);

-- Name: school_contracts school_contracts_contract_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY school_contracts
ADD
  CONSTRAINT school_contracts_contract_id_foreign FOREIGN KEY (contract_id) REFERENCES contracts(id);

-- Name: school_contracts school_contracts_school_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY school_contracts
ADD
  CONSTRAINT school_contracts_school_id_foreign FOREIGN KEY (school_id) REFERENCES schools(id);

-- Name: schools schools_country_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY schools
ADD
  CONSTRAINT schools_country_id_foreign FOREIGN KEY (country_id) REFERENCES countries(id);

-- Name: status_transitions status_transitions_contract_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY status_transitions
ADD
  CONSTRAINT status_transitions_contract_id_foreign FOREIGN KEY (contract_id) REFERENCES contracts(id);

-- Name: status_transitions status_transitions_who_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY status_transitions
ADD
  CONSTRAINT status_transitions_who_foreign FOREIGN KEY (who) REFERENCES users(id);

-- Name: suggested_metrics suggested_metrics_metric_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
ALTER TABLE
  ONLY suggested_metrics
ADD
  CONSTRAINT suggested_metrics_metric_id_foreign FOREIGN KEY (metric_id) REFERENCES metrics(id);

ALTER TABLE
  ONLY user_roles
ADD
  CONSTRAINT user_roles_role_id_foreign FOREIGN KEY (role_id) REFERENCES roles(id);

ALTER TABLE
  ONLY user_roles
ADD
  CONSTRAINT user_roles_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE
  ONLY users
ADD
  CONSTRAINT users_country_id_foreign FOREIGN KEY (country_id) REFERENCES countries(id);

ALTER TABLE
  ONLY users
ADD
  CONSTRAINT users_safeid_foreign FOREIGN KEY (safe_id) REFERENCES safes(id);

CREATE TABLE contract_status (
  id bigint NOT NULL,
  code character varying(40) NOT NULL,
  name character varying(255) NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE SEQUENCE contract_status_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE contract_status_id_seq OWNED BY contract_status.id;

CREATE TABLE school_users (
  id bigint NOT NULL,
  user_id bigint NOT NULL,
  school_id bigint NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

-- Name: school_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
CREATE SEQUENCE school_users_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Name: school_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
ALTER SEQUENCE school_users_id_seq OWNED BY school_users.id;

create table country_currencies (
  id bigint NOT NULL,
  country_id bigint NOT NULL,
  currency_id bigint NOT NULL,
  enabled boolean not null default true,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone
);

CREATE SEQUENCE country_currencies_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE country_currencies_id_seq OWNED BY country_currencies.id;

ALTER TABLE
  ONLY country_currencies
ALTER COLUMN
  id
SET
  DEFAULT nextval('country_currencies_id_seq' :: regclass);

ALTER TABLE
  ONLY country_currencies
ADD
  CONSTRAINT country_currencies_country_id_currency_id_unique UNIQUE (country_id, currency_id);

ALTER TABLE
  ONLY country_currencies
ADD
  CONSTRAINT country_currencies_pkey PRIMARY KEY (id);

ALTER TABLE
  ONLY country_currencies
ADD
  CONSTRAINT country_currencies_country_id_foreign FOREIGN KEY (country_id) REFERENCES countries(id);

ALTER TABLE
  ONLY country_currencies
ADD
  CONSTRAINT country_currencies_currency_id_foreign FOREIGN KEY (currency_id) REFERENCES currencies(id);

CREATE TABLE blockchain_transactions (
  id bigint NOT NULL,
  user_id bigint NOT NULL,
  contract_id bigint NULL,
  wallet_address character varying(1000) NOT NULL,
  network_id integer NOT NULL,
  network_name character varying(100) NOT NULL,
  transaction_type character varying(50) NOT NULL,
  transaction_hash character varying(100) NOT NULL,
  status integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone
);

CREATE SEQUENCE blockchain_transactions_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE blockchain_transactions_id_seq OWNED BY blockchain_transactions.id;

ALTER TABLE
  ONLY blockchain_transactions
ALTER COLUMN
  id
SET
  DEFAULT nextval('blockchain_transactions_id_seq' :: regclass);

ALTER TABLE
  ONLY blockchain_transactions
ADD
  CONSTRAINT blockchain_transactions_pkey PRIMARY KEY (id);

ALTER TABLE
  ONLY blockchain_transactions
ADD
  CONSTRAINT blockchain_transactions_users_foreign FOREIGN KEY (user_id) REFERENCES users(id);

CREATE TYPE contracts_for_automatic_payments_type AS (
  contract_id bigint,
  contract_name character varying(255),
  payment_receiver_id bigint,
  contract_budget decimal(20, 2),
  frecuency_id integer,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  currency_id bigint,
  contract_Uptime real,
  contract_Latency real,
  contract_DSpeed real,
  contract_USeepd real,
  qtty_schools_sla_ok_period integer,
  payment_amount decimal(20, 2),
  payment_discount decimal(20, 2),
  payment_date_from text,
  payment_date_to text
);




CREATE OR REPLACE FUNCTION get_sla_status_by_contract(contract_id_val integer, measure_date text)
RETURNS SETOF get_sla_status_by_contract_type
LANGUAGE plpgsql
AS
$BODY$
DECLARE
    result get_sla_status_by_contract_type;
BEGIN
    FOR result IN (
    SELECT
        contractId, contractName, schoolId, schoolName, createdAt,
        Contract_Uptime, Contract_Latency, Contract_DSpeed, Contract_USeepd,
        School_Uptime, School_Latency, School_DSpeed, School_USpeed,
        CASE WHEN contract_Uptime >= School_Uptime THEN 'SLA_Uptime_OK' ELSE 'SLA_Uptime_KO' END AS sla_uptime_status,
        CASE WHEN Contract_Latency >= School_Latency THEN 'SLA_latency_OK' ELSE 'SLA_latency_KO' END AS sla_latency_status,
        CASE WHEN Contract_DSpeed >= School_DSpeed THEN 'SLA_DSpeed_OK' ELSE 'SLA_DSpeed_KO' END AS sla_dspeed_status,
        CASE WHEN Contract_USeepd >= School_USpeed THEN 'SLA_USeepd_OK' ELSE 'SLA_USeepd_KO' END AS sla_useepd_status,
        CASE WHEN 
            -- contract_Uptime >= School_Uptime AND  -- omitted (it is not provided by UNICEF API)
            Contract_Latency >= School_Latency AND
            Contract_DSpeed >= School_DSpeed -- AND
            -- Contract_USeepd >= School_USpeed -- omitted (it not is provided by UNICEF API)
        THEN 'SLA_ALL_OK' ELSE 'SLA_ALL_KO' END AS sla_all_status
    FROM (
        SELECT 
            DISTINCT ms.contract_id AS contractId, c.name AS contractName, ms.created_at AS createdAt,
            ms.school_id AS schoolId, sc.name AS schoolName,
            COALESCE((SELECT value FROM expected_metrics WHERE contract_id = ms.contract_id AND metric_id = 1), 0) AS Contract_Uptime,
            COALESCE((SELECT value FROM expected_metrics WHERE contract_id = ms.contract_id AND metric_id = 2), 0) AS Contract_Latency,
            COALESCE((SELECT value FROM expected_metrics WHERE contract_id = ms.contract_id AND metric_id = 3), 0) AS Contract_DSpeed,
            COALESCE((SELECT value FROM expected_metrics WHERE contract_id = ms.contract_id AND metric_id = 4), 0) AS Contract_USeepd,
            COALESCE((SELECT value FROM measures WHERE school_id = ms.school_id AND contract_id = ms.contract_id AND metric_id = 1), 0) AS School_Uptime,
            COALESCE((SELECT value FROM measures WHERE school_id = ms.school_id AND contract_id = ms.contract_id AND metric_id = 2), 0) AS School_Latency,
            COALESCE((SELECT value FROM measures WHERE school_id = ms.school_id AND contract_id = ms.contract_id AND metric_id = 3), 0) AS School_DSpeed,
            COALESCE((SELECT value FROM measures WHERE school_id = ms.school_id AND contract_id = ms.contract_id AND metric_id = 4), 0) AS School_USpeed
        FROM measures ms
        INNER JOIN schools sc ON sc.id = ms.school_id
        INNER JOIN contracts c ON c.id = ms.contract_id
    ) AS x
    WHERE x.contractId = contract_id_val
    AND TO_CHAR(x.createdAt, 'YYYYMMDD') = measure_date
	) LOOP
		RETURN NEXT result;
	END LOOP;   
END;
$BODY$;

CREATE OR REPLACE FUNCTION check_if_all_sla_in_contract_met(contract_id integer, measure_date text)
RETURNS boolean
LANGUAGE plpgsql
AS
$BODY$
DECLARE
    sla_result get_sla_status_by_contract_type;
BEGIN
    FOR sla_result IN (SELECT * FROM get_sla_status_by_contract(contract_id, measure_date)) 
    LOOP
        IF sla_result.sla_all_status <> 'SLA_ALL_OK' THEN
            RETURN false;
        END IF;
    END LOOP;

    RETURN true;
END;
$BODY$;

CREATE OR REPLACE FUNCTION notifications_create_messages_conditions(
	config_code notification_sources.code%TYPE, 
	contract_id integer)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
BEGIN
		RAISE NOTICE 'notifications_create_messages_conditions - config_code: %', config_code;
		CASE
      WHEN UPPER(config_code) = 'SLAKO' THEN
        return check_if_all_sla_in_contract_met(contract_id, TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD')); 
			ELSE
        return true;
		END CASE;

EXCEPTION
	WHEN OTHERS THEN
    insert into logs (type, description) values ('NOTIFICATIONS', SQLERRM);
		RAISE EXCEPTION 'Error in function notifications_create_messages_conditions: %', SQLERRM;
END;
$BODY$;

CREATE OR REPLACE FUNCTION notifications_get_users (
  role_code roles.code%TYPE, 
  config_code notification_sources.code%TYPE, 
  contract_id_val contracts.id%TYPE,
  is_draft boolean
)
RETURNS SETOF users
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
  record users%ROWTYPE;
BEGIN
  CASE UPPER(role_code)
    WHEN 'GIGA.SUPER.ADMIN' THEN
			select u.*
			into record
			from users u
      inner join user_roles ur 
      on u.id = ur.user_id
      inner join roles r
      on r.id = ur.role_id
			where r.code = UPPER(role_code);
      RETURN NEXT record;
    WHEN 'GIGA.VIEW.ONLY' THEN
      select u.*
			into record
			from users u
      inner join user_roles ur 
      on u.id = ur.user_id
      inner join roles r
      on r.id = ur.role_id
			where r.code = UPPER(role_code);
      RETURN NEXT record;
    WHEN 'INTERNAL.CONTRACT.CREATOR' THEN
      -- special condition when contract is created by admin user
      IF (is_draft = true) THEN
        select u.*
        into record
        from users u
        inner join user_roles ur
        on ur.user_id = u.id
        inner join roles r
        on r.id = ur.role_id
        inner join DRAFTS c
        on c.created_by = u.id
        -- next condition avoid send 2 message to contract-creator (CC) when CC != GIGA.SUPER.ADMIN
        where r.code = 'GIGA.SUPER.ADMIN' 
        and c.id = contract_id_val;
      ELSE 
        select u.*
        into record
        from users u
        inner join user_roles ur
        on ur.user_id = u.id
        inner join roles r
        on r.id = ur.role_id
        inner join contracts c
        on c.created_by = u.id
        -- next condition avoid send 2 message to contract-creator (CC) when CC != GIGA.SUPER.ADMIN
        where r.code = 'GIGA.SUPER.ADMIN' 
        and c.id = contract_id_val;
      END IF;
      RETURN NEXT record;
    WHEN 'ISP.CONTRACT.MANAGER' THEN
      IF (is_draft = true) THEN
        select u.*
        into record
        from users u
        inner join user_roles ur 
        on u.id = ur.user_id
        inner join roles r
        on r.id = ur.role_id
        inner join isp_users ip 
        on ip.user_id = u.id
        inner join isps i 
        on i.id = ip.isp_id 
        inner join DRAFTS c 
        on c.isp_id = i.id 
        where c.id = contract_id_val
        and r.code = UPPER(role_code);
      ELSE
        select u.*
        into record
        from users u
        inner join user_roles ur 
        on u.id = ur.user_id
        inner join roles r
        on r.id = ur.role_id
        inner join isp_users ip 
        on ip.user_id = u.id
        inner join isps i 
        on i.id = ip.isp_id 
        inner join contracts c 
        on c.isp_id = i.id 
        where c.id = contract_id_val
        and r.code = UPPER(role_code);
      END IF;
			RETURN NEXT record;    
    WHEN 'ISP.CUSTOMER.SERVICE' THEN
      select u.*
      into record
      from users u
      inner join user_roles ur 
      on u.id = ur.user_id
      inner join roles r
      on r.id = ur.role_id
      where r.code = UPPER(role_code)
      and u.country_id = (
        CASE WHEN is_draft THEN (select country_id from DRAFTS where id = contract_id_val)
        ELSE (select country_id from contracts where id = contract_id_val) 
        END
      );
			RETURN NEXT record;   
    WHEN 'COUNTRY.CONTRACT.CREATOR' THEN
			select u.*
			into record
			from users u
      inner join user_roles ur 
      on u.id = ur.user_id
      inner join roles r
      on r.id = ur.role_id
      where r.code = UPPER(role_code)
      and u.country_id = (
        CASE WHEN is_draft THEN (select country_id from DRAFTS where id = contract_id_val)
        ELSE (select country_id from contracts where id = contract_id_val) 
        END
      );
			RETURN NEXT record;
    WHEN 'COUNTRY.ACCOUNTANT' THEN
			select u.*
			into record
			from users u
      inner join user_roles ur 
      on u.id = ur.user_id
      inner join roles r
      on r.id = ur.role_id
      where r.code = UPPER(role_code)
      and u.country_id = (
        CASE WHEN is_draft THEN (select country_id from DRAFTS where id = contract_id_val)
        ELSE (select country_id from contracts where id = contract_id_val) 
        END
      );
			RETURN NEXT record;
    WHEN 'COUNTRY.SUPER.ADMIN' THEN
			select u.*
			into record
			from users u
      inner join user_roles ur 
      on u.id = ur.user_id
      inner join roles r
      on r.id = ur.role_id
      where r.code = UPPER(role_code)
      and u.country_id = (
        CASE WHEN is_draft THEN (select country_id from DRAFTS where id = contract_id_val)
        ELSE (select country_id from contracts where id = contract_id_val) 
        END
      );
			RETURN NEXT record;
    WHEN 'COUNTRY.MONITOR' THEN
			select u.*
			into record
			from users u
      inner join user_roles ur 
      on u.id = ur.user_id
      inner join roles r
      on r.id = ur.role_id
      where r.code = UPPER(role_code)
      and u.country_id = (
        CASE WHEN is_draft THEN (select country_id from DRAFTS where id = contract_id_val)
        ELSE (select country_id from contracts where id = contract_id_val) 
        END
      );
			RETURN NEXT record;
    WHEN 'SCHOOL.CONNECTIVITY.MANAGER' THEN
      select u.*
      into record
      from users u 
      inner join user_roles ur
      on u.id =ur.user_id
      inner join roles r
      on r.id = ur.role_id
      inner join school_users su
      on su.user_id = u.id
      inner join schools s
      on s.id = su.school_id
      inner join school_contracts sc
      on sc.school_id = s.id
      where sc.contract_id = contract_id_val;
      RETURN NEXT record;
  END CASE;
EXCEPTION
WHEN OTHERS THEN
	RAISE EXCEPTION 'Error in function notifications_get_users: %', SQLERRM;
END;
$BODY$;

CREATE OR REPLACE FUNCTION notifications_create_messages(
	config_code notification_sources.code%TYPE, 
	contract_id integer,
  is_draft boolean
)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	-- Get configurations roles
	cursor_config CURSOR FOR 
	select nc.id config_id, nc.source_id, ns.code as sourceCode, nc.role_id, r.code as roleCode, nc.channel
	from notification_configurations nc
	inner join notification_sources ns
	on ns.id = nc.source_id
	inner join roles r
	on r.id = nc.role_id
	WHERE UPPER(ns.code) = UPPER(config_code);
	
	record RECORD;
	msg_title notification_messages.title%TYPE;
	msg_description notification_messages.message%TYPE;
	user_record users%ROWTYPE;
	contract_name contracts.name%TYPE;
	contract_created_at contracts.created_at%TYPE;
	notification_status notifications.status%TYPE;
	notification_sent_at notifications.sent_at%TYPE;
  conditionsResult boolean;
	
BEGIN
  -- Check notifications create messages conditions 
  conditionsResult := notifications_create_messages_conditions(config_code, contract_id);
  IF (NOT conditionsResult) THEN
    RAISE NOTICE 'notifications_create_messages - conditions to create messages have not been met';
    return true;
  END IF;

	OPEN cursor_config;
	LOOP
		FETCH cursor_config INTO record;
		EXIT WHEN NOT FOUND;
		
		-- for each role, get users and loop to insert notifications
		FOR user_record IN SELECT * FROM notifications_get_users(record.roleCode, record.sourceCode, contract_id, is_draft) LOOP

			-- Get title and message
			RAISE NOTICE 'notifications_create_messages - Role: % - get title and message', record.role_id;
			SELECT title, message
			INTO msg_title, msg_description
			FROM notification_messages nm
			WHERE notification_config_id = record.config_id
			AND LOWER(preferred_language) = LOWER(user_record.default_language)
			LIMIT 1;

      RAISE NOTICE 'notifications_create_messages - title: % & message: %', msg_title, msg_description;
      IF (COALESCE(msg_description, '') = '') THEN
        RAISE NOTICE 'notifications_create_messages - message empty';
      ELSE
        -- Replace patterns in title and message
        RAISE NOTICE 'notifications_create_messages - Role: % - get title and message with patterns replaced', record.role_id;
        SELECT final_msg_title, final_msg_description 
        INTO msg_title, msg_description
        FROM notifications_get_replaced_messages(record.sourceCode, msg_title, msg_description, contract_id, is_draft);
        RAISE NOTICE 'notifications_create_messages - Role: % - replaced title and message: %, %', record.role_id, msg_title, msg_description;
        
        -- Insert en notifications
        RAISE NOTICE 'notifications_create_messages - Role: % - final insert', record.role_id;
        IF record.channel = 'API' THEN
          notification_status = 'SENT';
          notification_sent_at = CURRENT_TIMESTAMP;
        ELSE
          notification_status = 'CREATED';
          notification_sent_at = null;
        END IF;
              
        INSERT INTO public.notifications (id, config_id, user_id, email, status, title, message, sub_message, 
                      created_at, sent_at, viewed_at, discarded_at) 
        VALUES (nextval('notification_id_seq'), record.config_id, user_record.id, user_record.email, notification_status, COALESCE(msg_title, 'NOT FOUND TITLE'), COALESCE(msg_description, 'NOT FOUND MSG'), '', 
            CURRENT_TIMESTAMP, notification_sent_at, NULL, NULL);
      END IF;

		END LOOP; -- users

	END LOOP; -- notifications-config
	
	CLOSE cursor_config;
	
	RETURN true;
EXCEPTION
	WHEN OTHERS THEN
    insert into logs (type, description) values ('NOTIFICATIONS', SQLERRM);
		RAISE EXCEPTION 'Error in function notifications_create_messages: %', SQLERRM;
END;
$BODY$;

CREATE OR REPLACE FUNCTION notifications_get_replaced_messages(
	config_code character varying,
	msg_title character varying,
	msg_description text,
	param_contract_id bigint,
  is_draft boolean
  )
  RETURNS TABLE(final_msg_title character varying, final_msg_description text) 
  LANGUAGE 'plpgsql'
  VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	contract_name contracts.name%TYPE;
  contract_launch_date contracts.launch_date%TYPE;
	contract_created_at contracts.created_at%TYPE;
  contract_full_cashback character varying;
  contract_user_name character varying;
  payment_id payments.id%TYPE;
  payment_full_amount character varying;
BEGIN	
    RAISE NOTICE 'notifications_get_replaced_messages - config_code: % - particular replace by config type', config_code;
    RAISE NOTICE 'notifications_get_replaced_messages - config_code: % - get contract data', config_code;
    
    IF (is_draft = true) THEN
      SELECT c.name, c.created_at, c.launch_date, COALESCE(u.name || ' ' || u.last_name, 'unknown')
      INTO contract_name, contract_created_at, contract_launch_date, contract_user_name
      FROM DRAFTS c
      LEFT JOIN users u
      ON c.created_by = u.id      
      WHERE c.id = param_contract_id
      LIMIT 1;
    ELSE
      SELECT c.name, c.created_at, c.launch_date, COALESCE(u.name || ' ' || u.last_name, 'unknown')
      INTO contract_name, contract_created_at, contract_launch_date, contract_user_name
      FROM contracts c
      LEFT JOIN users u
      ON c.created_by = u.id      
      WHERE c.id = param_contract_id
      LIMIT 1;
    END IF;

    final_msg_title := REPLACE(msg_title, '#{{CONTRACT_NAME}}', contract_name);
    final_msg_description := REPLACE(msg_description, '#{{CONTRACT_NAME}}', contract_name);
    final_msg_description := REPLACE(final_msg_description, '#{{INSTALLATION_DATE}}', TO_CHAR(contract_launch_date, 'MM-DD-YYYY HH24:MI:SS'));
    final_msg_description := REPLACE(final_msg_description, '#{{CREATION_DATE}}', TO_CHAR(contract_created_at, 'MM-DD-YYYY HH24:MI:SS'));
    final_msg_description := REPLACE(final_msg_description, '#{{CREATED_BY}}', contract_user_name);
		CASE
			WHEN
        UPPER(config_code) = 'MPAYCRT' or 
        UPPER(config_code) = 'APAYCRT' or
        UPPER(config_code) = 'MPAYAPP' THEN
        -- Get payment data
        RAISE NOTICE 'notifications_get_replaced_messages - config_code: % - get payment data', config_code;
        select p.id || '', c.code || ' ' || COALESCE(p.amount, 0) as fullAmount
        into payment_id, payment_full_amount
        from payments p
        inner join currencies c
        on c.id = p.currency_id
        where p.contract_id = param_contract_id
        order by p.id desc 
        limit 1;

        IF COALESCE(payment_id, 0) != 0 THEN
          final_msg_description := REPLACE(final_msg_description, '#{{PAYMENT_ID}}', payment_id || '');
          final_msg_description := REPLACE(final_msg_description, '#{{PAYMENT_AMOUNT}}', payment_full_amount);
        END IF;

			WHEN
        UPPER(config_code) = 'ACONCSB' THEN
        -- Get cashback data
        RAISE NOTICE 'notifications_get_replaced_messages - config_code: % - get cashback data', config_code;
        select cy.code || ' ' || COALESCE(c.cashback, 0) as fullCashbach
        into contract_full_cashback
        from contracts c
        inner join currencies cy
        on cy.id = c.currency_id
        WHERE c.id = param_contract_id
        LIMIT 1;

        IF COALESCE(contract_full_cashback, '') != '' THEN
          final_msg_description := REPLACE(final_msg_description, '#{{CONTRACT_CASHBACK}}', contract_full_cashback);
        END IF;

      WHEN UPPER(config_code) = 'SLAKO' THEN
        RAISE NOTICE 'notifications_get_replaced_messages - config_code: % - get measure data', config_code;
				final_msg_description := REPLACE(final_msg_description, '#{{measureDate}}', TO_CHAR(CURRENT_TIMESTAMP, 'MM-DD-YYYY HH24:MI:SS'));

			ELSE
				final_msg_title := final_msg_title;
				final_msg_description := final_msg_description;
		END CASE;

  RETURN QUERY SELECT final_msg_title, final_msg_description; 
EXCEPTION
WHEN OTHERS THEN
	RAISE EXCEPTION 'Error in function notifications_get_replaced_messages: %', SQLERRM;
  insert into logs (type, description) values ('NOTIFICATIONS', SQLERRM);
END;
$BODY$;

CREATE OR REPLACE FUNCTION notifications_support_fill_tables(
	source_code notification_sources.code%TYPE,
  role_code roles.code%TYPE,
  priority notification_configurations.priority%TYPE,
  msg_channel notification_configurations.channel%TYPE,
  msg_language notification_messages.preferred_language%TYPE,
  msg_title notification_messages.title%TYPE,
  msg_description notification_messages.message%TYPE)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  config_id notification_configurations.id%TYPE;
  config_id_exists boolean;
BEGIN

  -- config id could already exists if the message was inserted by another langauges
  SELECT id
  INTO config_id
  from notification_configurations
	where role_id = (select id from roles where code  = role_code)
	and source_id = (select id from notification_sources where code = source_code)
	and channel = msg_channel;

  IF (COALESCE(config_id, 0) = 0) THEN
    INSERT INTO notification_configurations(id, source_id, role_id, channel, locked_for_user, read_only, priority, created_at, updated_at) 
    VALUES (nextval('notification_configurations_id_seq'), 
            (select id from notification_sources where code = source_code), 
            (select id from roles where code = role_code), 
            msg_channel, false, false, priority, CURRENT_TIMESTAMP, NULL);
    select id 
    into config_id
    from notification_configurations
    where role_id = (select id from roles where code  = role_code)
    and source_id = (select id from notification_sources where code = source_code)
    and channel = msg_channel;
  END IF;

  INSERT INTO notification_messages (id, notification_config_id, preferred_language, title, message, sub_message, created_at, updated_at) 
  VALUES (nextval('notification_messages_id_seq'), config_id, msg_language, msg_title, msg_description, NULL, CURRENT_TIMESTAMP, NULL);
	
	RETURN true;
EXCEPTION
	WHEN OTHERS THEN
		RAISE EXCEPTION 'Error in function notifications_support_fill_tables: %', SQLERRM;
END;
$BODY$;


CREATE OR REPLACE FUNCTION get_school_metrics(contract_id_val contracts.id%TYPE, metric_id_val measures.metric_id%TYPE, start_date_val TEXT, end_date_val TEXT)
RETURNS TABLE (
  contract_id bigint,
  school_id bigint,
  avg_school_value numeric,
  contract_value numeric,
  school_qtty_days_sla_ok integer,
  school_qtty_measures_records integer,
  qtty_days_in_period integer,
  contempled_qtty_days_sla_ok integer,
  contempled_sla_ok_percent numeric
)
LANGUAGE 'plpgsql'
VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    qtty_days_in_period = CAST(COALESCE(CAST(LEFT(end_date_val, 8) AS BIGINT) - CAST(LEFT(start_date_val, 8) AS integer),0) as integer);

    RETURN QUERY
    SELECT
      CAST(contract_id_val as bigint) as contract_id,
      CAST(x.school_id as bigint) as school_id,
      CAST(x.avg_school_value as numeric) as avg_school_value,
      CAST(x.contract_value as numeric) as contract_value,
      CAST(x.school_qtty_days_sla_ok as integer) as school_qtty_days_sla_ok,
      CAST(x.school_qtty_measures_records as integer) as school_qtty_measures_records,
      CAST(qtty_days_in_period as integer) as qtty_days_in_period,
      CAST((qtty_days_in_period-x.school_qtty_measures_records+x.school_qtty_days_sla_ok) as integer) 
        as contempled_qtty_days_sla_ok,
      CAST((((qtty_days_in_period-x.school_qtty_measures_records+x.school_qtty_days_sla_ok)*100)/qtty_days_in_period) as numeric)
        as contempled_sla_ok_percent
    FROM (
      SELECT 
        sch.id as school_id, 
        COALESCE(avg(ms.value), 0) avg_school_value,
        COALESCE((select max(value) from expected_metrics em where em.contract_id = c.id and em.metric_id = metric_id_val), 0) as contract_value,
        SUM(CASE 
          WHEN (
              sch.reliable_measures = true and 
              COALESCE(ms.value, 0) >= COALESCE((select max(value) from expected_metrics em where em.contract_id = c.id and em.metric_id = metric_id_val), 0)) THEN 1
          WHEN (sch.reliable_measures = false) THEN 1
          ELSE 0
        END) as school_qtty_days_sla_ok,
      COALESCE(COUNT(ms.id), 0) as school_qtty_measures_records      
      from school_contracts schc
      inner join contracts c
      on schc.contract_id = c.id
      inner join schools sch
      on sch.id = schc.school_id
      left join measures ms
      on ms.school_id = sch.id
      where c.id = contract_id_val
      and ms.metric_id = metric_id_val
      and CAST(TO_CHAR(ms.created_at, 'YYYYMMDDHH24MISS') AS BIGINT) between CAST(start_date_val AS BIGINT) and CAST(end_date_val AS BIGINT)
      group by c.id, sch.id
    ) as x;

EXCEPTION
WHEN OTHERS THEN
	RAISE EXCEPTION 'Error in function get_school_metrics: %', SQLERRM;
END;
$BODY$;


CREATE OR REPLACE FUNCTION contracts_for_automatic_payments_conditions()
RETURNS SETOF contracts_for_automatic_payments_type
LANGUAGE plpgsql
AS
$BODY$
DECLARE
    cursor_config CURSOR FOR 
    SELECT 
      c.id as contract_id, 
      c.name as contract_name, 
      c.payment_receiver_id,
      c.budget as contract_budget, 
      c.frequency_id, 
      UPPER(f.name) as frequency_name,
      c.start_date, 
      c.end_date, 
      c.currency_id,
      DATE_PART('day', c.end_date - c.start_date) contract_days_difference, 
      UPPER(f.name) contract_frequency_name,
      (CASE UPPER(f.name) 
        WHEN 'MONTHLY' THEN DATE_PART('day', c.end_date - c.start_date) / 30
        WHEN 'BIWEEKLY' THEN DATE_PART('day', c.end_date - c.start_date) / 15
        WHEN 'WEEKLY' THEN DATE_PART('day', c.end_date - c.start_date) / 7
        WHEN 'DAILY' THEN DATE_PART('day', c.end_date - c.start_date)
        ELSE DATE_PART('day', c.end_date - c.start_date)
      END) AS contract_qtty_payments_todo,
      COALESCE(sum(amount),0) contract_total_payments_amount,
      COALESCE(sum(discount),0) contract_total_payments_discount,
      COALESCE(COUNT(p.id),0) contract_qtty_payments_done,
      MAX(p.date_to) as contract_payment_max_date,
      COALESCE(CAST(TO_CHAR(MAX(p.date_to), 'YYYYMMDD') AS bigint),0) as contract_max_payment_date_yyyymmdd,
      COALESCE(CAST(TO_CHAR(MAX(p.date_to), 'YYYYMM') AS bigint),0) as contract_max_payment_date_yyyymm,
      CAST(TO_CHAR(NOW(), 'YYYYMMDD') AS BIGINT) as current_date_yyyymmdd,
      CAST(TO_CHAR(NOW(), 'YYYYMM') AS BIGINT) as current_date_yyyymm
    FROM
      contracts c
    INNER JOIN
      frequencies f on f.id = c.frequency_id
    LEFT JOIN
      payments p on p.contract_id = c.id
    WHERE
      c.automatic = true
    AND
      c.status = (select id from contract_status where upper(code) = 'ONGOING')
    GROUP BY
      c.id, c.budget, c.start_date, c.end_date, f.name;

    record RECORD;
    result contracts_for_automatic_payments_type;
    verified_payments_done boolean;
    verified_payments_period boolean;
    payment_date_from text;
    payment_date_to text;
    contracts_qtty_schools integer;
BEGIN
    OPEN cursor_config;
    LOOP
      FETCH cursor_config INTO record;
      EXIT WHEN NOT FOUND;

      SELECT COALESCE(count(1), 0)
      INTO contracts_qtty_schools
      FROM school_contracts
      WHERE contract_id = record.contract_id;

      verified_payments_done = false;
      verified_payments_period = false;

      IF (record.contract_qtty_payments_done > 0) THEN
        /* Check payments already done in all periods */
        IF ((COALESCE(record.contract_total_payments_amount,0) + 
          COALESCE(record.contract_total_payments_discount,0)) < record.contract_budget)
          AND (record.contract_qtty_payments_done < record.contract_qtty_payments_todo) THEN
          verified_payments_done = true;
        END IF;

        /* Check payments in current period and set payment's dates */
        IF UPPER(record.frequency_name) = 'MONTHLY' AND
          (record.contract_max_payment_date_yyyymm < record.current_date_yyyymm) THEN
          payment_date_from = TO_CHAR((record.contract_payment_max_date + INTERVAL '1 day'), 'YYYYMMDD000000');
          payment_date_to = TO_CHAR((record.contract_payment_max_date + INTERVAL '1 month'), 'YYYYMMDD235959');
          verified_payments_period = true;
        END IF;
        IF UPPER(record.frequency_name) = 'BIWEEKLY' AND
          (record.contract_max_payment_date_yyyymm < record.current_date_yyyymm) THEN
          payment_date_from = TO_CHAR((record.contract_payment_max_date + INTERVAL '1 day'), 'YYYYMMDD000000');
          payment_date_to = TO_CHAR((record.contract_payment_max_date + INTERVAL '15 day'), 'YYYYMMDD235959');
          verified_payments_period = true;
        END IF;
        IF UPPER(record.frequency_name) = 'WEEKLY' AND
          (record.contract_max_payment_date_yyyymm < record.current_date_yyyymm) THEN
          payment_date_from = TO_CHAR((record.contract_payment_max_date + INTERVAL '1 day'), 'YYYYMMDD000000');
          payment_date_to = TO_CHAR((record.contract_payment_max_date + INTERVAL '7 day'), 'YYYYMMDD235959');
          verified_payments_period = true;
        END IF;
        IF UPPER(record.frequency_name) = 'DAILY' AND
          (record.contract_max_payment_date_yyyymmdd < record.current_date_yyyymmdd) THEN
          payment_date_from = TO_CHAR((record.contract_payment_max_date + INTERVAL '1 day'), 'YYYYMMDD000000');
          payment_date_to = TO_CHAR((record.contract_payment_max_date + INTERVAL '1 day'), 'YYYYMMDD235959');
          verified_payments_period = true;
        END IF;
      ELSE
        /* no payments done yet */ 
        verified_payments_period = true;
        verified_payments_done = true;

        IF UPPER(record.frequency_name) = 'MONTHLY' THEN
          payment_date_from = TO_CHAR(DATE_TRUNC('month', NOW()), 'YYYYMMDD000000');
          payment_date_to = TO_CHAR((DATE_TRUNC('month', NOW()) + INTERVAL '1 month - 1 second'), 'YYYYMMDDHH24MISS');
        END IF;

        IF UPPER(record.frequency_name) = 'BIWEEKLY' THEN
          payment_date_from = TO_CHAR(NOW(), 'YYYYMMDD000000');
          payment_date_to = TO_CHAR(NOW() + INTERVAL '15 day', 'YYYYMMDD235959');
        END IF;

        IF UPPER(record.frequency_name) = 'WEEKLY' THEN
          payment_date_from = TO_CHAR(NOW(), 'YYYYMMDD000000');
          payment_date_to = TO_CHAR(NOW() + INTERVAL '7 day', 'YYYYMMDD235959');
        END IF;

        IF UPPER(record.frequency_name) = 'DAILY' THEN
          payment_date_from = TO_CHAR(NOW(), 'YYYYMMDD000000');
          payment_date_to = TO_CHAR(NOW(), 'YYYYMMDD235959');
        END IF;
      END IF;

      IF (verified_payments_done = true and verified_payments_period = true) THEN
        SELECT 
            c.id as contract_id, 
            c.name as contract_name, 
            c.payment_receiver_id,
            c.budget as contract_budget, 
            c.frequency_id, 
            c.start_date, 
            c.end_date, 
            c.currency_id,
            sla_metrics.contract_uptime,
            sla_metrics.contract_latency,
            sla_metrics.contract_dspeed,
            sla_metrics.contract_uspeed,
            sla_metrics.qtty_schools_sla_ok_period,
            (record.contract_budget / record.contract_qtty_payments_todo) payment_amount,
            CASE 
              WHEN COALESCE(contracts_qtty_schools, 0) = 0 THEN 0 
              ELSE 1-(ROUND(
                    (CAST(sla_metrics.qtty_schools_sla_ok_period as numeric) / 
                    CAST(contracts_qtty_schools as numeric)), 2)) 
            END payment_discount_percent,
            payment_date_from,
            payment_date_to
        INTO result
        FROM contracts c
        left join
          ( select 
            metrics_uptime.contract_id,
            max(metrics_uptime.contract_value) as contract_uptime,
            max(metrics_latency.contract_value) as contract_latency,
            max(metrics_dspeed.contract_value) as contract_dspeed,
            max(metrics_uspeed.contract_value) as contract_uspeed,
            SUM(CASE WHEN metrics_latency.contempled_sla_ok_percent = 100 AND metrics_dspeed.contempled_sla_ok_percent = 100 THEN 1
                ELSE 0 END) as qtty_schools_sla_ok_period
            from get_school_metrics (record.contract_id, 1, payment_date_from, payment_date_to) as metrics_uptime
            inner join get_school_metrics (record.contract_id, 2, payment_date_from, payment_date_to) as metrics_latency
            on metrics_uptime.school_id = metrics_latency.school_id
            inner join get_school_metrics (record.contract_id, 3, payment_date_from, payment_date_to) as metrics_dspeed
            on metrics_latency.school_id = metrics_dspeed.school_id
            inner join get_school_metrics (record.contract_id, 4, payment_date_from, payment_date_to) as metrics_uspeed
            on metrics_dspeed.school_id = metrics_uspeed.school_id
            group by metrics_uptime.contract_id
          ) as sla_metrics
        on c.id = sla_metrics.contract_id
        WHERE c.id = record.contract_id;

        RETURN NEXT result;
      END IF;

    END LOOP;
    CLOSE cursor_config;

EXCEPTION
WHEN OTHERS THEN
	RAISE EXCEPTION 'Error in function contracts_for_automatic_payments_conditions: %', SQLERRM;
END;
$BODY$;

CREATE OR REPLACE VIEW contracts_for_automatic_payments AS
SELECT * 
FROM contracts_for_automatic_payments_conditions();
