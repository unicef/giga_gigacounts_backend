-- Get permission by role
select r.code, r.name, p.name
from roles r
inner join role_permissions rp
on r.id = rp.role_id 
inner join permissions p
on p.id = rp.permission_id
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
order by ns.name;


-- Get notifictions messages by config code
select * 
from notification_messages 
where notification_config_id in (
    select id from notification_configurations 
    where source_id = (select id from notification_sources where code = 'SLAKO'));


-- Get notifications with role, config, channel, etc.
select distinct n.id, ns.code, nc.channel,  n.status, u.email, n.title, n.message
from notifications n
inner join notification_configurations nc
on nc.id = n.config_id
inner join notification_sources ns
on ns.id = nc.source_id
inner join roles r
on r.id = nc.role_id
inner join notification_messages nm
on nm.notification_config_id = nc.id
inner join users u 
on u.id = n.user_id
inner join user_roles ur
on ur.user_id = u.id
and ur.role_id = r.id
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
