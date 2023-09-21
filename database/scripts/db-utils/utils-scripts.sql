-- Get permission by role
select r.code, r.name, p.name
from roles r
inner join role_permissions rp
on r.id = rp.role_id 
inner join permissions p
on p.id = rp.permission_id
order by r.code, r.name;

-- Get permission by yser
select u.email, r.code, r.name, p.name
from roles r
inner join role_permissions rp
on r.id = rp.role_id 
inner join permissions p
on p.id = rp.permission_id
inner join user_roles ur
on ur.role_id = r.id
inner join users u
on u.id = ur.user_id
where ur.user_id = (select id from users where email = 'isp.cm1.brazil@giga.com')
order by r.code, r.name;

-- Get notifications config
select nc.id as config_id, ns.name, nc.channel, r.name, nm.preferred_language, nm.title, nm.message
from notification_configurations nc
inner join notification_sources ns
on ns.id = nc.source_id
inner join roles r
on r.id = nc.role_id
left join notification_messages nm
on nm.notification_config_id = nc.id
where notification_config_id in (
    select id from notification_configurations 
    where source_id = (select id from notification_sources where code = 'APAYCRT'))
order by ns.name;

-- Get notifications config with replaced messages (test with contract = 1)
select 
nc.id as config_id, ns.code , ns.name, nc.channel, 
r.name, nm.preferred_language, nm.title, nm.message,
x.*
from notification_configurations nc
inner join notification_sources ns
on ns.id = nc.source_id
inner join roles r
on r.id = nc.role_id
left join notification_messages nm
on nm.notification_config_id = nc.id
inner join notifications_get_replaced_messages (ns.code, nm.title, nm.message, 1) x
on 1=1
order by ns.name;

-- Get notifictions messages by config code
select * 
from notification_messages 
where notification_config_id in (
    select id from notification_configurations 
    where source_id = (select id from notification_sources where code = 'SLAKO'));


-- Get notifications messages by config_id
Select *
from notification_messages
where notification_config_id in 
	(select id
	from notification_configurations
	where source_id in (select id from notification_sources where code in ('ACONPUB','MCONPUB'))
	and role_id in (select id from roles where code = 'ISP.CONTRACT.MANAGER'))
	

-- Get notifications with role, config, channel, etc.
select distinct n.id, ns.code, nc.channel,  n.status, u.email, n.title, n.message
from notifications n
left join notification_configurations nc
on nc.id = n.config_id
left join notification_sources ns
on ns.id = nc.source_id
left join roles r
on r.id = nc.role_id
left join notification_messages nm
on nm.notification_config_id = nc.id
left join users u 
on u.id = n.user_id
left join user_roles ur
on ur.user_id = u.id
and ur.role_id = r.id
where ns.code = 'FDBACK'
order by n.id desc limit 10;


-- Compare contract and schools metrics (qos) / measures
select contractId, contractName, schoolId, schoolName, createdAt,
    Contract_Uptime, Contract_Latency, Contract_DSpeed, Contract_USeepd,
    School_Uptime, School_Latency, School_DSpeed, School_USpeed,
    CASE WHEN contract_Uptime >= School_Uptime THEN 'SLA_Uptime_OK' ELSE 'SLA_Uptime_KO' END as cmp_uptime,
    CASE WHEN Contract_Latency >= School_Latency THEN 'SLA_latency_OK' ELSE 'SLA_latency_KO' END as cmp_latency,
    CASE WHEN Contract_DSpeed >= School_DSpeed THEN 'SLA_DSpeed_OK' ELSE 'SLA_DSpeed_KO' END as cmp_dspeed,
    CASE WHEN Contract_USeepd >= School_USpeed THEN 'SLA_USeepd_OK' ELSE 'SLA_USeepd_KO' END as cmp_uspeed,
    CASE WHEN 
            -- contract_Uptime >= School_Uptime AND -- no provided by UNICEF API
            Contract_Latency >= School_Latency AND
            Contract_DSpeed >= School_DSpeed -- AND
            -- Contract_USeepd >= School_USpeed -- no provided by UNICEF API
    THEN 'SLA_ALL_OK' ELSE 'SLA_ALL_KO' END as cmp_all
from (
select 
    distinct ms.contract_id as contractId, c.name as contractName, ms.created_at as createdAt,
    ms.school_id as schoolId, sc.name as schoolName,
    COALESCE((select value from expected_metrics where contract_id = ms.contract_id and metric_id = 1),0) as Contract_Uptime,
    COALESCE((select value from expected_metrics where contract_id = ms.contract_id and metric_id = 2),0) as Contract_Latency,
    COALESCE((select value from expected_metrics where contract_id = ms.contract_id and metric_id = 3),0) as Contract_DSpeed,
    COALESCE((select value from expected_metrics where contract_id = ms.contract_id and metric_id = 4),0) as Contract_USeepd,
    COALESCE((select value from measures where school_id = ms.school_id and contract_id = ms.contract_id and metric_id = 1),0) as School_Uptime,
    COALESCE((select value from measures where school_id = ms.school_id and contract_id = ms.contract_id and metric_id = 2),0) as School_Latency,
    COALESCE((select value from measures where school_id = ms.school_id and contract_id = ms.contract_id and metric_id = 3),0) as School_DSpeed,
    COALESCE((select value from measures where school_id = ms.school_id and contract_id = ms.contract_id and metric_id = 4),0) as School_USpeed
from measures ms
inner join schools sc
on sc.id = ms.school_id
inner join contracts c
on c.id = ms.contract_id
) as x
where x.contractId  = 1
and TO_CHAR(x.createdAt, 'YYYYMMDD') =  '20230707' -- TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD');


-- Get average schools measures in period by contract_id (example contract_id = 1)
select 
    metrics_uptime.school_id,
    metrics_uptime.avg_school_value as avg_sch_uptime,
    metrics_uptime.contract_value as contract_uptime,
    metrics_uptime.school_qtty_days_sla_ok as school_qtty_days_sla_ok_uptime,
    metrics_latency.avg_school_value as avg_sch_latency,
    metrics_latency.contract_value as contract_latency,
    metrics_latency.school_qtty_days_sla_ok as school_qtty_days_sla_ok_latency, 
    metrics_dspeed.avg_school_value as avg_sch_dspeed,
    metrics_dspeed.contract_value as contract_dspeed,
    metrics_dspeed.school_qtty_days_sla_ok as school_qtty_days_sla_ok_dspeed, 
    metrics_uspeed.avg_school_value as avg_sch_ospeed,
    metrics_uspeed.contract_value as contract_ospeed,
    metrics_uspeed.school_qtty_days_sla_ok as school_qtty_days_sla_ok_ospeed
from  get_school_metrics (1, 1, '20230707000000', '20230731595959') as metrics_uptime
inner join get_school_metrics (1, 2, '20230707000000', '20230731595959') as metrics_latency
on metrics_uptime.school_id = metrics_latency.school_id
inner join get_school_metrics (1, 3, '20230707000000', '20230731595959') as metrics_dspeed
on metrics_latency.school_id = metrics_dspeed.school_id
inner join get_school_metrics (1, 4, '20230707000000', '20230731595959') as metrics_uspeed
on metrics_dspeed.school_id = metrics_uspeed.school_id;

-- Get average schools measures in period by contract_id (example contract_id = 1) Summary
SELECT
    metrics_uptime.school_id,
    metrics_latency.contempled_sla_ok_percent as sla_ok_latency, 
    metrics_dspeed.contempled_sla_ok_percent as sla_ok_dspeed,
    max(metrics_uptime.contract_value) as contract_uptime,
    max(metrics_latency.contract_value) as contract_latency,
    max(metrics_dspeed.contract_value) as contract_dspeed,
    max(metrics_uspeed.contract_value) as contract_uspeed,
    COUNT(CASE 
    WHEN metrics_latency.contempled_sla_ok_percent = 100 AND metrics_dspeed.contempled_sla_ok_percent = 100 THEN 1
    ELSE 0 
    END) as qtty_schools_sla_ok_period
from  get_school_metrics (1, 1, '20230707000000', '20230731595959') as metrics_uptime
inner join get_school_metrics (1, 2, '20230707000000', '20230731595959') as metrics_latency
on metrics_uptime.school_id = metrics_latency.school_id
inner join get_school_metrics (1, 3, '20230707000000', '20230731595959') as metrics_dspeed
on metrics_latency.school_id = metrics_dspeed.school_id
inner join get_school_metrics (1, 4, '20230707000000', '20230731595959') as metrics_uspeed
on metrics_dspeed.school_id = metrics_uspeed.school_id
group by
    metrics_uptime.school_id,
    metrics_latency.contempled_sla_ok_percent, 
    metrics_dspeed.contempled_sla_ok_percent

-- Update all sequence for all tables
DECLARE
    table_name text;
    sequence_name text;
BEGIN
    -- Itera sobre todas las tablas en el esquema "public"
    FOR table_name IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' LOOP
        -- Obtiene el nombre de la secuencia asociada a la tabla
        sequence_name := pg_get_serial_sequence(table_name, 'id');

        -- Verifica si la secuencia existe y si sí, actualiza su valor
        IF sequence_name IS NOT NULL THEN
            -- Obtiene el máximo valor actual de la tabla
            EXECUTE format('SELECT setval(''%s'', (SELECT COALESCE(MAX(id), 0) + 1 FROM %s))', sequence_name, table_name);
        END IF;
    END LOOP;
END $$;

-- Get Dashboard Schools
select 
    sc.id, sc.external_id, sc.name, sc.address, sc.education_level, sc.country_id, 
    (string_to_array(geopoint, ','))[1] AS lat,
    (string_to_array(geopoint, ','))[2] AS lng,
(select avg(value) as avg_uptime from measures where school_id = sc.id and metric_id = 1) as avg_uptime,
(select avg(value) as avg_latency from measures where school_id = sc.id and metric_id = 2) as avg_latency,
(select avg(value) as avg_dspeed from measures where school_id = sc.id and metric_id = 3) as avg_dspeed,
(select avg(value) as avg_uspeed from measures where school_id = sc.id and metric_id = 4) as avg_uspeed
from schools sc

-- ISP Users
select i.*, u.email
from isp_users iu
inner join isps i
on i.id = iu.isp_id
inner join users u
on u.id = iu.user_id

-- Insert metrics mock
insert into measures (metric_id, value, school_id, created_at, contract_id)
select metric_id, value, school_id, created_at + interval '1 month', contract_id
from measures
where contract_id = 1;


-- delete frafts
SELECT conname, conrelid::regclass AS table_name FROM pg_constraint WHERE confrelid = 'drafts'::regclass;
delete from draft_external_contacts;
delete from draft_attachments;
delete from draft_stakeholders;
delete from draft_isp_contacts;
delete from drafts;
