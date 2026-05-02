import {Request, Response} from 'express';
import pool from '../utils/db';

export const getProfile = async (req : Request, res: Response) : Promise<any> => {
    try{
        const{ userId } = req.params;

        const query = 'SELECT * FROM hustle_profiles WHERE user_id = $1';
        const result = await pool.query(query, [userId]);

        if(result.rows.length === 0){
            return res.status(404).json({success : false, error: 'Profile not found for the given user ID.'});
        }

        res.status(200).json({success : true, profile : result.rows[0]});
    } catch (error) {
        console.error('Error fetching profile from database.', error);
        res.status(500).json({ success: false, error: 'Failed to fetch profile from database.' });
    }
};

export const saveParsedProfile = async (req : Request, res: Response) : Promise<any> => {
    try{
        const{profileData, userId} = req.body;

        if(!userId || !profileData){
            return res.status(400).json({success : false, error: 'User ID and profile data are required.'});
        }

        if (isNaN(Number(userId))) {
            return res.status(400).json({ 
                success: false, 
                error: `Invalid user ID format. Expected a Number, but received: ${userId}` 
            });
        }

        const {name, target_role, summary, core_skills, additional_skills, vibe} = profileData.profile;
        const improvements = profileData.improvements;

        const upsertQuery = `
      INSERT INTO hustle_profiles 
        (user_id, name, target_role, summary, core_skills, additional_skills, vibe, improvements, updated_at) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        target_role = EXCLUDED.target_role,
        summary = EXCLUDED.summary,
        core_skills = EXCLUDED.core_skills,
        additional_skills = EXCLUDED.additional_skills,
        vibe = EXCLUDED.vibe,
        improvements = EXCLUDED.improvements,
        updated_at = NOW()
      RETURNING *;
    `;

    const result = await pool.query(upsertQuery, [
      userId, name, target_role, summary, core_skills, additional_skills, vibe, improvements
    ]);

    res.status(200).json({ 
      success: true, 
      message: 'Profile saved successfully',
      profile: result.rows[0] 
    });

  } catch (error) {
    console.error('Error saving profile to database:', error);
    res.status(500).json({ success: false, error: 'Failed to save profile to the database.' });
  }
};
