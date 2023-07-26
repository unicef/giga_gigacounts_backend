CREATE TABLE adonis_schema (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    batch integer NOT NULL,
    migration_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


CREATE SEQUENCE adonis_schema_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE adonis_schema_id_seq OWNED BY adonis_schema.id;


CREATE TABLE adonis_schema_versions (
    version integer NOT NULL
);


CREATE TABLE api_tokens (
    id integer NOT NULL,
    user_id integer,
    name character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    token character varying(64) NOT NULL,
    expires_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    refresh_token character varying(255) NOT NULL,
    refresh_token_expires_at timestamp with time zone NOT NULL
);


CREATE SEQUENCE api_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE api_tokens_id_seq OWNED BY api_tokens.id;

CREATE TYPE notification_channel AS ENUM (
    'PUSH',
    'EMAIL',
    'API'
);


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

CREATE SEQUENCE attachments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE contract_attachments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- Name: contract_attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE contract_attachments_id_seq OWNED BY contract_attachments.id;


-- Name: contracts; Type: TABLE; Schema: public; Owner: -

CREATE TABLE contracts (
    id bigint NOT NULL,
    country_id bigint,
    government_behalf boolean DEFAULT false,
    automatic BOOLEAN NOT NULL DEFAULT false,
    name character varying(255),
    lta_id bigint,
    currency_id bigint NOT NULL,
    budget decimal(20,2) NOT NULL,
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
    sign_request_string character varying(255),
    signed_with_wallet boolean default false,
    signed_wallet_address character varying(255)
);


-- Name: contracts_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE contracts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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
    preferred_language character varying(10) DEFAULT 'EN'::character varying NOT NULL
);


-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE countries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE countries_id_seq OWNED BY countries.id;


-- Name: currencies; Type: TABLE; Schema: public; Owner: -

CREATE TABLE currencies (
    id bigint NOT NULL,
    code character varying(255) DEFAULT ''::character varying,
    name character varying(255),
    type integer not null default 1,
    contract_address character varying(256) null,
    network_id integer null,
    enabled boolean not null default true,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


-- Name: currencies_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE currencies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- Name: currencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE currencies_id_seq OWNED BY currencies.id;


-- Name: draft_attachments; Type: TABLE; Schema: public; Owner: -

CREATE TABLE draft_attachments (
    id bigint NOT NULL,
    draft_id bigint NOT NULL,
    attachment_id bigint NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


-- Name: draft_attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE draft_attachments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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
    budget decimal(20,2) NOT NULL,
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
    notes character varying(5000) NULL
);


-- Name: drafts_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE drafts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- Name: drafts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE drafts_id_seq OWNED BY drafts.id;


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

CREATE SEQUENCE expected_metrics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- Name: expected_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE expected_metrics_id_seq OWNED BY expected_metrics.id;


-- Name: frequencies; Type: TABLE; Schema: public; Owner: -

CREATE TABLE frequencies (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


-- Name: frequencies_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE frequencies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- Name: frequencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE frequencies_id_seq OWNED BY frequencies.id;

-- Name: help_requests; Type: TABLE; Schema: public; Owner: -

CREATE TABLE help_requests (
    id bigint NOT NULL,
    code character varying(255),
    functionality character varying(255),
    type character varying(255),
    description character varying(255),
    user_id bigint NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


-- Name: help_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE help_requests_id_seq
    AS bigint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- Name: help_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE help_requests_id_seq OWNED BY help_requests.id;

-- Name: help_request_values; Type: TABLE; Schema: public; Owner: -

CREATE TABLE help_request_values (
    id bigint NOT NULL,
    code character varying(255) PRIMARY KEY,
    option text[]
);


-- Name: help_request_values_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE help_request_values_id_seq
    AS bigint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- Name: help_request_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE help_request_values_id_seq OWNED BY help_request_values.id;

-- Name: functionalities; Type: TABLE; Schema: public; Owner: -

CREATE TABLE functionalities (
    id bigint NOT NULL,
    name character varying(255),
    code character varying(255) PRIMARY KEY
);


-- Name: functionalities_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE functionalities_id_seq
    AS bigint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- Name: functionalities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE functionalities_id_seq OWNED BY functionalities.id;

-- Name: feedbacks; Type: TABLE; Schema: public; Owner: -

CREATE TABLE feedbacks (
    id bigint NOT NULL,
    rate bigint NOT NULL,
    comment character varying(255),
    created_at timestamp with time zone
);


-- Name: feedbacks_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE feedbacks_id_seq
    AS bigint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE isp_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE isps_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE lta_isps_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE ltas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE measures_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- Name: measures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE measures_id_seq OWNED BY measures.id;


-- Name: metrics; Type: TABLE; Schema: public; Owner: -

CREATE TABLE metrics (
    id integer NOT NULL,
    code character varying(20) NOT NULL DEFAULT '',
    name character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    unit character varying(255) DEFAULT ''::character varying NOT NULL,
    weight integer DEFAULT 0 NOT NULL
);


-- Name: metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE metrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- Name: metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE metrics_id_seq OWNED BY metrics.id;


-- Name: users; Type: TABLE; Schema: public; Owner: -

CREATE TABLE users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    last_name character varying(255) DEFAULT ''::character varying NOT NULL,
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
    default_language character varying(2) DEFAULT 'EN'::character varying,
    automatic_contracts_enabled boolean NOT NULL default false,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


-- Name: notification_configurations_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE notification_configurations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- Name: notification_configurations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE notification_configurations_id_seq OWNED BY users.id;


-- Name: notification_configurations; Type: TABLE; Schema: public; Owner: -

CREATE TABLE notification_configurations (
    id bigint DEFAULT nextval('notification_configurations_id_seq'::regclass) NOT NULL,
    source_id integer NOT NULL,
    role_id integer NOT NULL,
    channel notification_channel NOT NULL,
    locked_for_user boolean DEFAULT false,
    read_only boolean DEFAULT false,
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

CREATE SEQUENCE notification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE notification_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE notification_source_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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
    amount integer NOT NULL,
    currency_id bigint,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    description character varying(255),
    status integer DEFAULT 0 NOT NULL,
    created_by bigint NOT NULL,
    metrics jsonb
);


-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE role_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE safes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- Name: safes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE safes_id_seq OWNED BY safes.id;


-- Name: school_contracts; Type: TABLE; Schema: public; Owner: -

CREATE TABLE school_contracts (
    id bigint NOT NULL,
    school_id bigint NOT NULL,
    contract_id bigint NOT NULL,
    budget decimal(20,2) NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


-- Name: school_contracts_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE school_contracts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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
    reliable_measures boolean not null default true,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    giga_id_school character varying(255)
);


-- Name: schools_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE schools_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE status_transitions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE suggested_metrics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE TABLE logs
(
    type character varying(100),
    description character varying(5000)
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

CREATE OR REPLACE FUNCTION notifications_create_messages(
	config_code notification_sources.code%TYPE, 
	contract_id integer)
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
		FOR user_record IN SELECT * FROM notifications_get_users(record.roleCode, record.sourceCode, contract_id) LOOP

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
        FROM notifications_get_replaced_messages(record.sourceCode, msg_title, msg_description, contract_id);
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
	contract_id bigint)
    RETURNS TABLE(final_msg_title character varying, final_msg_description text) 
    LANGUAGE 'plpgsql'
    VOLATILE PARALLEL UNSAFE

AS $BODY$
DECLARE
	contract_name contracts.name%TYPE;
	contract_created_at contracts.created_at%TYPE;
BEGIN	
		RAISE NOTICE 'notifications_get_replaced_messages - config_code: % - particular replace by config type', config_code;
		CASE
			WHEN UPPER(config_code) = 'CONCRTM' or UPPER(config_code) = 'CONCRTA' THEN
				-- Get contract data
				RAISE NOTICE 'notifications_get_replaced_messages - config_code: % - get contract data', config_code;
				SELECT name, created_at
				INTO contract_name, contract_created_at
				FROM contracts
				WHERE id = contract_id
				LIMIT 1;
				final_msg_title := REPLACE(msg_title, '#{{contractId}}', contract_name);
				final_msg_description := REPLACE(msg_description, '#{{contractId}}', contract_name);
				final_msg_description := REPLACE(final_msg_description, '#{{creationDate}}', TO_CHAR(contract_created_at, 'MM-DD-YYYY HH24:MI:SS'));

      WHEN UPPER(config_code) = 'SLAKO' THEN
        RAISE NOTICE 'notifications_get_replaced_messages - config_code: % - get measure data', config_code;
        SELECT name
				INTO contract_name
				FROM contracts
				WHERE id = contract_id
				LIMIT 1;
				final_msg_title := REPLACE(msg_title, '#{{contractId}}', contract_name);
				final_msg_description := REPLACE(msg_description, '#{{measureDate}}', TO_CHAR(CURRENT_TIMESTAMP, 'MM-DD-YYYY HH24:MI:SS'));
        final_msg_description := REPLACE(final_msg_description, '#{{contractId}}', contract_name);

			WHEN UPPER(config_code) = 'PWDRST' THEN
				final_msg_title := msg_title;
				final_msg_description := msg_description;
			ELSE
				final_msg_title := msg_title;
				final_msg_description := msg_description;
		END CASE;

  RETURN QUERY SELECT final_msg_title, final_msg_description; 
EXCEPTION
WHEN OTHERS THEN
	RAISE EXCEPTION 'Error in function notifications_get_replaced_messages: %', SQLERRM;
  insert into logs (type, description) values ('NOTIFICATIONS', SQLERRM);
END;
$BODY$;


CREATE OR REPLACE FUNCTION notifications_get_users (role_code roles.code%TYPE, config_code notification_sources.code%TYPE, contract_id contracts.id%TYPE)
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
        and c.id = contract_id;
      RETURN NEXT record;
    WHEN 'ISP.CONTRACT.MANAGER' THEN
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
			where c.id = contract_id
      and r.code = UPPER(role_code);
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
      and u.country_id = (select country_id from contracts where id = contract_id);
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
      and u.country_id = (select country_id from contracts where id = contract_id);
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
      and u.country_id = (select country_id from contracts where id = contract_id);
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
      and u.country_id = (select country_id from contracts where id = contract_id);
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
      and u.country_id = (select country_id from contracts where id = contract_id);
			RETURN NEXT record;
    WHEN 'SCHOOL.CONNECTIVITY.MANAGER' THEN
      -- pending relationship
      select * into record from users where id = 0;
      RETURN NEXT record;
    ELSE
      RETURN QUERY SELECT * from users where id = 0;
  END CASE;

EXCEPTION
WHEN OTHERS THEN
	RAISE EXCEPTION 'Error in function notifications_get_users: %', SQLERRM;
END;
$BODY$;


CREATE OR REPLACE FUNCTION notifications_support_fill_tables(
	source_code notification_sources.code%TYPE,
  role_code roles.code%TYPE,
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

  -- config id could already exists if the message was insert by another langauges
  SELECT id
  INTO config_id
  from notification_configurations
	where role_id = (select id from roles where code  = role_code)
	and source_id = (select id from notification_sources where code = source_code)
	and channel = msg_channel;

  IF (COALESCE(config_id, 0) = 0) THEN
    INSERT INTO notification_configurations(id, source_id, role_id, channel, locked_for_user, read_only, created_at, updated_at) 
    VALUES (nextval('notification_configurations_id_seq'), 
            (select id from notification_sources where code = source_code), 
            (select id from roles where code = role_code), 
            msg_channel, false, false, CURRENT_TIMESTAMP, NULL);

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


-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE user_roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE user_roles_id_seq OWNED BY user_roles.id;


-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -

ALTER SEQUENCE users_id_seq OWNED BY users.id;


-- Name: adonis_schema id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY adonis_schema ALTER COLUMN id SET DEFAULT nextval('adonis_schema_id_seq'::regclass);


-- Name: api_tokens id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY api_tokens ALTER COLUMN id SET DEFAULT nextval('api_tokens_id_seq'::regclass);


-- Name: attachments id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY attachments ALTER COLUMN id SET DEFAULT nextval('attachments_id_seq'::regclass);


-- Name: contract_attachments id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY contract_attachments ALTER COLUMN id SET DEFAULT nextval('contract_attachments_id_seq'::regclass);


-- Name: contracts id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY contracts ALTER COLUMN id SET DEFAULT nextval('contracts_id_seq'::regclass);


-- Name: countries id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY countries ALTER COLUMN id SET DEFAULT nextval('countries_id_seq'::regclass);


-- Name: currencies id; Type: DEFAULT; Schema: public; Owner: -

alter table ONLY currencies add constraint currencies_code_network_unique unique(code, network_id);
ALTER TABLE ONLY currencies ALTER COLUMN id SET DEFAULT nextval('currencies_id_seq'::regclass);


-- Name: draft_attachments id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY draft_attachments ALTER COLUMN id SET DEFAULT nextval('draft_attachments_id_seq'::regclass);


-- Name: drafts id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY drafts ALTER COLUMN id SET DEFAULT nextval('drafts_id_seq'::regclass);


-- Name: expected_metrics id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY expected_metrics ALTER COLUMN id SET DEFAULT nextval('expected_metrics_id_seq'::regclass);


-- Name: frequencies id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY frequencies ALTER COLUMN id SET DEFAULT nextval('frequencies_id_seq'::regclass);

-- Name: help_requests id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY help_requests ALTER COLUMN id SET DEFAULT nextval('help_requests_id_seq'::regclass);

-- Name: help_request_values id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY help_request_values ALTER COLUMN id SET DEFAULT nextval('help_request_values_id_seq'::regclass);

-- Name: functionalities id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY functionalities ALTER COLUMN id SET DEFAULT nextval('functionalities_id_seq'::regclass);

-- Name: feedbacks id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY feedbacks ALTER COLUMN id SET DEFAULT nextval('feedbacks_id_seq'::regclass);

-- Name: isp_users id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY isp_users ALTER COLUMN id SET DEFAULT nextval('isp_users_id_seq'::regclass);


-- Name: isps id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY isps ALTER COLUMN id SET DEFAULT nextval('isps_id_seq'::regclass);


-- Name: lta_isps id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY lta_isps ALTER COLUMN id SET DEFAULT nextval('lta_isps_id_seq'::regclass);


-- Name: ltas id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY ltas ALTER COLUMN id SET DEFAULT nextval('ltas_id_seq'::regclass);


-- Name: measures id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY measures ALTER COLUMN id SET DEFAULT nextval('measures_id_seq'::regclass);


-- Name: metrics id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY metrics ALTER COLUMN id SET DEFAULT nextval('metrics_id_seq'::regclass);


-- Name: notification_messages id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY notification_messages ALTER COLUMN id SET DEFAULT nextval('notification_messages_id_seq'::regclass);


-- Name: notification_sources id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY notification_sources ALTER COLUMN id SET DEFAULT nextval('notification_source_id_seq'::regclass);


-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY notifications ALTER COLUMN id SET DEFAULT nextval('notification_id_seq'::regclass);


-- Name: payments id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY payments ALTER COLUMN id SET DEFAULT nextval('payments_id_seq'::regclass);


-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY permissions ALTER COLUMN id SET DEFAULT nextval('permissions_id_seq'::regclass);


-- Name: role_permissions id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY role_permissions ALTER COLUMN id SET DEFAULT nextval('role_permissions_id_seq'::regclass);


-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY roles ALTER COLUMN id SET DEFAULT nextval('roles_id_seq'::regclass);


-- Name: safes id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY safes ALTER COLUMN id SET DEFAULT nextval('safes_id_seq'::regclass);


-- Name: school_contracts id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY school_contracts ALTER COLUMN id SET DEFAULT nextval('school_contracts_id_seq'::regclass);


-- Name: schools id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY schools ALTER COLUMN id SET DEFAULT nextval('schools_id_seq'::regclass);


-- Name: status_transitions id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY status_transitions ALTER COLUMN id SET DEFAULT nextval('status_transitions_id_seq'::regclass);


-- Name: suggested_metrics id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY suggested_metrics ALTER COLUMN id SET DEFAULT nextval('suggested_metrics_id_seq'::regclass);


-- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY user_roles ALTER COLUMN id SET DEFAULT nextval('user_roles_id_seq'::regclass);


-- Name: users id; Type: DEFAULT; Schema: public; Owner: -

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


-- Name: adonis_schema adonis_schema_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY adonis_schema
    ADD CONSTRAINT adonis_schema_pkey PRIMARY KEY (id);


-- Name: api_tokens api_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY api_tokens
    ADD CONSTRAINT api_tokens_pkey PRIMARY KEY (id);


-- Name: api_tokens api_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY api_tokens
    ADD CONSTRAINT api_tokens_token_unique UNIQUE (token);


-- Name: attachments attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);


-- Name: contract_attachments contract_attachments_contract_id_attachment_id_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY contract_attachments
    ADD CONSTRAINT contract_attachments_contract_id_attachment_id_unique UNIQUE (contract_id, attachment_id);


-- Name: contract_attachments contract_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY contract_attachments
    ADD CONSTRAINT contract_attachments_pkey PRIMARY KEY (id);


-- Name: contracts contracts_name_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY contracts
    ADD CONSTRAINT contracts_name_unique UNIQUE (name);


-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);


-- Name: countries countries_name_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY countries
    ADD CONSTRAINT countries_name_unique UNIQUE (name);


-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


-- Name: currencies currencies_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY currencies
    ADD CONSTRAINT currencies_pkey PRIMARY KEY (id);


-- Name: draft_attachments draft_attachments_draft_id_attachment_id_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY draft_attachments
    ADD CONSTRAINT draft_attachments_draft_id_attachment_id_unique UNIQUE (draft_id, attachment_id);


-- Name: draft_attachments draft_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY draft_attachments
    ADD CONSTRAINT draft_attachments_pkey PRIMARY KEY (id);


-- Name: drafts drafts_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY drafts
    ADD CONSTRAINT drafts_pkey PRIMARY KEY (id);


-- Name: expected_metrics expected_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY expected_metrics
    ADD CONSTRAINT expected_metrics_pkey PRIMARY KEY (id);


-- Name: frequencies frequencies_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY frequencies
    ADD CONSTRAINT frequencies_pkey PRIMARY KEY (id);


-- Name: isp_users isp_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY isp_users
    ADD CONSTRAINT isp_users_pkey PRIMARY KEY (id);


-- Name: isp_users isp_users_user_id_isp_id_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY isp_users
    ADD CONSTRAINT isp_users_user_id_isp_id_unique UNIQUE (user_id, isp_id);


-- Name: isps isps_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY isps
    ADD CONSTRAINT isps_pkey PRIMARY KEY (id);


-- Name: lta_isps lta_isps_lta_id_isp_id_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY lta_isps
    ADD CONSTRAINT lta_isps_lta_id_isp_id_unique UNIQUE (lta_id, isp_id);


-- Name: lta_isps lta_isps_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY lta_isps
    ADD CONSTRAINT lta_isps_pkey PRIMARY KEY (id);


-- Name: ltas ltas_name_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY ltas
    ADD CONSTRAINT ltas_name_unique UNIQUE (name);


-- Name: ltas ltas_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY ltas
    ADD CONSTRAINT ltas_pkey PRIMARY KEY (id);


-- Name: measures measures_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY measures
    ADD CONSTRAINT measures_pkey PRIMARY KEY (id);


-- Name: metrics metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY metrics
    ADD CONSTRAINT metrics_pkey PRIMARY KEY (id);


-- Name: notification_messages notification_config_id_preferred_lang_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY notification_messages
    ADD CONSTRAINT notification_config_id_preferred_lang_unique UNIQUE (notification_config_id, preferred_language);


-- Name: notification_configurations notification_configuration_source_id_role_id_channel_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY notification_configurations
    ADD CONSTRAINT notification_configuration_source_id_role_id_channel_unique UNIQUE (source_id, role_id, channel);


-- Name: notification_configurations notification_configurations_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY notification_configurations
    ADD CONSTRAINT notification_configurations_pkey PRIMARY KEY (id);


-- Name: notification_messages notification_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY notification_messages
    ADD CONSTRAINT notification_messages_pkey PRIMARY KEY (id);


-- Name: notifications notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


-- Name: notification_sources notification_source_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY notification_sources
    ADD CONSTRAINT notification_source_pkey PRIMARY KEY (id);


-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


-- Name: permissions permissions_name_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY permissions
    ADD CONSTRAINT permissions_name_unique UNIQUE (name);


-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


-- Name: role_permissions role_permissions_role_id_permission_id_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY role_permissions
    ADD CONSTRAINT role_permissions_role_id_permission_id_unique UNIQUE (role_id, permission_id);


-- Name: roles roles_name_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY roles
    ADD CONSTRAINT roles_name_unique UNIQUE (name);


-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


-- Name: safes safes_address_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY safes
    ADD CONSTRAINT safes_address_unique UNIQUE (address);


-- Name: safes safes_name_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY safes
    ADD CONSTRAINT safes_name_unique UNIQUE (name);


-- Name: safes safes_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY safes
    ADD CONSTRAINT safes_pkey PRIMARY KEY (id);


-- Name: school_contracts school_contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY school_contracts
    ADD CONSTRAINT school_contracts_pkey PRIMARY KEY (id);


-- Name: school_contracts school_contracts_school_id_contract_id_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY school_contracts
    ADD CONSTRAINT school_contracts_school_id_contract_id_unique UNIQUE (school_id, contract_id);


-- Name: schools schools_external_id_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY schools
    ADD CONSTRAINT schools_external_id_unique UNIQUE (external_id);


-- Name: schools schools_giga_id_school_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY schools
    ADD CONSTRAINT schools_giga_id_school_unique UNIQUE (giga_id_school);


-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


-- Name: status_transitions status_transitions_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY status_transitions
    ADD CONSTRAINT status_transitions_pkey PRIMARY KEY (id);


-- Name: suggested_metrics suggested_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY suggested_metrics
    ADD CONSTRAINT suggested_metrics_pkey PRIMARY KEY (id);


-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


-- Name: user_roles user_roles_user_id_role_id_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY user_roles
    ADD CONSTRAINT user_roles_user_id_role_id_unique UNIQUE (user_id, role_id);


-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Name: users users_wallet_address_unique; Type: CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY users
    ADD CONSTRAINT users_wallet_address_unique UNIQUE (wallet_address);


-- Name: api_tokens api_tokens_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY api_tokens
    ADD CONSTRAINT api_tokens_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


-- Name: contract_attachments contract_attachments_attachment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY contract_attachments
    ADD CONSTRAINT contract_attachments_attachment_id_foreign FOREIGN KEY (attachment_id) REFERENCES attachments(id);


-- Name: contract_attachments contract_attachments_contract_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY contract_attachments
    ADD CONSTRAINT contract_attachments_contract_id_foreign FOREIGN KEY (contract_id) REFERENCES contracts(id);


-- Name: contracts contracts_country_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY contracts
    ADD CONSTRAINT contracts_country_id_foreign FOREIGN KEY (country_id) REFERENCES countries(id);


-- Name: contracts contracts_created_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY contracts
    ADD CONSTRAINT contracts_created_by_foreign FOREIGN KEY (created_by) REFERENCES users(id);


-- Name: contracts contracts_currency_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY contracts
    ADD CONSTRAINT contracts_currency_id_foreign FOREIGN KEY (currency_id) REFERENCES currencies(id);


-- Name: contracts contracts_frequency_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY contracts
    ADD CONSTRAINT contracts_frequency_id_foreign FOREIGN KEY (frequency_id) REFERENCES frequencies(id);


-- Name: contracts contracts_isp_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY contracts
    ADD CONSTRAINT contracts_isp_id_foreign FOREIGN KEY (isp_id) REFERENCES isps(id);


-- Name: contracts contracts_lta_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY contracts
    ADD CONSTRAINT contracts_lta_id_foreign FOREIGN KEY (lta_id) REFERENCES ltas(id);


-- Name: draft_attachments draft_attachments_attachment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY draft_attachments
    ADD CONSTRAINT draft_attachments_attachment_id_foreign FOREIGN KEY (attachment_id) REFERENCES attachments(id);


-- Name: draft_attachments draft_attachments_draft_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY draft_attachments
    ADD CONSTRAINT draft_attachments_draft_id_foreign FOREIGN KEY (draft_id) REFERENCES drafts(id);


-- Name: drafts drafts_country_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY drafts
    ADD CONSTRAINT drafts_country_id_foreign FOREIGN KEY (country_id) REFERENCES countries(id);


-- Name: drafts drafts_created_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY drafts
    ADD CONSTRAINT drafts_created_by_foreign FOREIGN KEY (created_by) REFERENCES users(id);


-- Name: drafts drafts_currency_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY drafts
    ADD CONSTRAINT drafts_currency_id_foreign FOREIGN KEY (currency_id) REFERENCES currencies(id);


-- Name: drafts drafts_frequency_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY drafts
    ADD CONSTRAINT drafts_frequency_id_foreign FOREIGN KEY (frequency_id) REFERENCES frequencies(id);


-- Name: drafts drafts_isp_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY drafts
    ADD CONSTRAINT drafts_isp_id_foreign FOREIGN KEY (isp_id) REFERENCES isps(id);


-- Name: drafts drafts_lta_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY drafts
    ADD CONSTRAINT drafts_lta_id_foreign FOREIGN KEY (lta_id) REFERENCES ltas(id);

-- Name: help_requests_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY help_requests
    ADD CONSTRAINT help_requests_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id);

-- Name: help_requests_code_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY help_requests
    ADD CONSTRAINT help_requests_code_foreign FOREIGN KEY (code) REFERENCES help_request_values(code);

-- Name: help_requests_functionality_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY help_requests
    ADD CONSTRAINT help_requests_functionality_foreign FOREIGN KEY (functionality) REFERENCES functionalities(code);

-- Name: expected_metrics expected_metrics_contract_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY expected_metrics
    ADD CONSTRAINT expected_metrics_contract_id_foreign FOREIGN KEY (contract_id) REFERENCES contracts(id);


-- Name: expected_metrics expected_metrics_metric_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY expected_metrics
    ADD CONSTRAINT expected_metrics_metric_id_foreign FOREIGN KEY (metric_id) REFERENCES metrics(id);


-- Name: isp_users isp_users_isp_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY isp_users
    ADD CONSTRAINT isp_users_isp_id_foreign FOREIGN KEY (isp_id) REFERENCES isps(id);


-- Name: isp_users isp_users_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY isp_users
    ADD CONSTRAINT isp_users_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id);


-- Name: isps isps_country_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY isps
    ADD CONSTRAINT isps_country_id_foreign FOREIGN KEY (country_id) REFERENCES countries(id);


-- Name: lta_isps lta_isps_isp_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY lta_isps
    ADD CONSTRAINT lta_isps_isp_id_foreign FOREIGN KEY (isp_id) REFERENCES isps(id);


-- Name: lta_isps lta_isps_lta_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY lta_isps
    ADD CONSTRAINT lta_isps_lta_id_foreign FOREIGN KEY (lta_id) REFERENCES ltas(id);


-- Name: ltas ltas_country_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY ltas
    ADD CONSTRAINT ltas_country_id_foreign FOREIGN KEY (country_id) REFERENCES countries(id);


-- Name: ltas ltas_created_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY ltas
    ADD CONSTRAINT ltas_created_by_foreign FOREIGN KEY (created_by) REFERENCES users(id);


-- Name: measures measures_contract_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY measures
    ADD CONSTRAINT measures_contract_id_foreign FOREIGN KEY (contract_id) REFERENCES contracts(id);


-- Name: measures measures_metric_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY measures
    ADD CONSTRAINT measures_metric_id_foreign FOREIGN KEY (metric_id) REFERENCES metrics(id);


-- Name: measures measures_school_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY measures
    ADD CONSTRAINT measures_school_id_foreign FOREIGN KEY (school_id) REFERENCES schools(id);


-- Name: notifications notification_config_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notification_config_id_fkey FOREIGN KEY (config_id) REFERENCES notification_configurations(id);


-- Name: notification_configurations notification_configurations_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY notification_configurations
    ADD CONSTRAINT notification_configurations_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id);


-- Name: notification_configurations notification_configurations_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY notification_configurations
    ADD CONSTRAINT notification_configurations_source_id_fkey FOREIGN KEY (source_id) REFERENCES notification_sources(id);


-- Name: notification_messages notification_messages_notification_config_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY notification_messages
    ADD CONSTRAINT notification_messages_notification_config_id_fkey FOREIGN KEY (notification_config_id) REFERENCES notification_configurations(id);


-- Name: notifications notification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notification_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


-- Name: payments payments_contract_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY payments
    ADD CONSTRAINT payments_contract_id_foreign FOREIGN KEY (contract_id) REFERENCES contracts(id);


-- Name: payments payments_created_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY payments
    ADD CONSTRAINT payments_created_by_foreign FOREIGN KEY (created_by) REFERENCES users(id);


-- Name: payments payments_currency_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY payments
    ADD CONSTRAINT payments_currency_id_foreign FOREIGN KEY (currency_id) REFERENCES currencies(id);


-- Name: payments payments_invoice_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY payments
    ADD CONSTRAINT payments_invoice_id_foreign FOREIGN KEY (invoice_id) REFERENCES attachments(id);


-- Name: payments payments_paid_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY payments
    ADD CONSTRAINT payments_paid_by_foreign FOREIGN KEY (paid_by) REFERENCES users(id);


-- Name: payments payments_receipt_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY payments
    ADD CONSTRAINT payments_receipt_id_foreign FOREIGN KEY (receipt_id) REFERENCES attachments(id);


-- Name: role_permissions role_permissions_permission_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY role_permissions
    ADD CONSTRAINT role_permissions_permission_id_foreign FOREIGN KEY (permission_id) REFERENCES permissions(id);


-- Name: role_permissions role_permissions_role_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY role_permissions
    ADD CONSTRAINT role_permissions_role_id_foreign FOREIGN KEY (role_id) REFERENCES roles(id);


-- Name: school_contracts school_contracts_contract_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY school_contracts
    ADD CONSTRAINT school_contracts_contract_id_foreign FOREIGN KEY (contract_id) REFERENCES contracts(id);


-- Name: school_contracts school_contracts_school_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY school_contracts
    ADD CONSTRAINT school_contracts_school_id_foreign FOREIGN KEY (school_id) REFERENCES schools(id);


-- Name: schools schools_country_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY schools
    ADD CONSTRAINT schools_country_id_foreign FOREIGN KEY (country_id) REFERENCES countries(id);


-- Name: status_transitions status_transitions_contract_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY status_transitions
    ADD CONSTRAINT status_transitions_contract_id_foreign FOREIGN KEY (contract_id) REFERENCES contracts(id);


-- Name: status_transitions status_transitions_who_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY status_transitions
    ADD CONSTRAINT status_transitions_who_foreign FOREIGN KEY (who) REFERENCES users(id);


-- Name: suggested_metrics suggested_metrics_metric_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -

ALTER TABLE ONLY suggested_metrics
    ADD CONSTRAINT suggested_metrics_metric_id_foreign FOREIGN KEY (metric_id) REFERENCES metrics(id);

ALTER TABLE ONLY user_roles
    ADD CONSTRAINT user_roles_role_id_foreign FOREIGN KEY (role_id) REFERENCES roles(id);

ALTER TABLE ONLY user_roles
    ADD CONSTRAINT user_roles_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE ONLY users
    ADD CONSTRAINT users_country_id_foreign FOREIGN KEY (country_id) REFERENCES countries(id);

ALTER TABLE ONLY users
    ADD CONSTRAINT users_safeid_foreign FOREIGN KEY (safe_id) REFERENCES safes(id);


CREATE TABLE contract_status (
    id bigint NOT NULL,
    code character varying(40) NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

CREATE SEQUENCE contract_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE contract_status_id_seq OWNED BY contract_status.id;


CREATE TABLE school_users (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    school_id bigint NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


-- Name: school_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -

CREATE SEQUENCE school_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


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

CREATE SEQUENCE country_currencies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE country_currencies_id_seq OWNED BY country_currencies.id;
ALTER TABLE ONLY country_currencies ALTER COLUMN id SET DEFAULT nextval('country_currencies_id_seq'::regclass);
ALTER TABLE ONLY country_currencies ADD CONSTRAINT country_currencies_country_id_currency_id_unique UNIQUE (country_id, currency_id);
ALTER TABLE ONLY country_currencies ADD CONSTRAINT country_currencies_pkey PRIMARY KEY (id);
ALTER TABLE ONLY country_currencies ADD CONSTRAINT country_currencies_country_id_foreign FOREIGN KEY (country_id) REFERENCES countries(id);
ALTER TABLE ONLY country_currencies ADD CONSTRAINT country_currencies_currency_id_foreign FOREIGN KEY (currency_id) REFERENCES currencies(id);

