-- SQL Migration: Update 'doors' JSONB array structure in 'measurements_v2' table
-- This script converts old structure (extraTitle/extraDesc) to the new structure (extraItems array)

UPDATE measurements_v2
SET doors = (
  SELECT jsonb_agg(
    CASE 
      WHEN door ? 'extraItems' THEN door
      ELSE (door - 'extraTitle' - 'extraDesc') || jsonb_build_object(
        'extraItems', 
        jsonb_build_array(
          jsonb_build_object(
            'id', 'migrated-' || gen_random_uuid(),
            'title', COALESCE(door->>'extraTitle', ''),
            'desc', COALESCE(door->>'extraDesc', '')
          )
        )
      )
    END
  )
  FROM jsonb_array_elements(doors) AS door
)
WHERE doors IS NOT NULL;
