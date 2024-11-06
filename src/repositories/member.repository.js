import { pool } from "../db.config.js";

// Member 데이터 삽입
export const addMember = async(data) => {
    const conn = await pool.getConnection();
    try{
        // 해당 이메일(중복된 이메일)의 사용자가 있는지 확인
        const [confirm] = await pool.query(
            `SELECT EXISTS(SELECT 1 FROM member WHERE email = ?) as isExistEmail;`, 
            data.email
        );
        if (confirm[0].isExistEmail) {
            return null;
        }
        // 중복된 이메일이 아닐 경우, 회원 정보 member 테이블에 삽입
        const [result] = await pool.query(
            `INSERT INTO member (member_name, nickname, gender, birth, location_address, email, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [
                data.name,
                data.nickname,
                data.gender,
                data.birth,
                data.location,
                data.email,
                data.phoneNumber, 
            ]
        );
        return result.insertId; // 생성된 회원의 ID 반환
        // insertId - DB에 새로운 레코드 삽입
        // 새 레코드가 삽입될 때 해당 레코드의 자동 증가 ID 값을 반환한다.
    } catch(err) { // 오류 처리
        throw new Error(`
            🚫 오류 발생 🚫 
            요청 파라미터 확인 바람 (${err})
        `);
    } finally {
        conn.release(); // DB 연결 해지
    }
};

// 회원 정보 조회
export const getMember = async (memberId) => {
    const conn = await pool.getConnection();
    try{
        const [member] = await pool.query(
            `SELECT * FROM member WHERE id = ?;`,
            memberId
        )
        console.log(member);
        if (member.length == 0){
            return null;
        }
        return member;
    }catch (err){
        throw new Error(`
            🚫 오류 발생 🚫 
            요청 파라미터 확인 바람 (${err})
        `);
    }finally{
        conn.release();
    }
};

// 음식 - 선호_음식_종류 매핑
export const setFavoriteFoodKind = async(memberId, favoriteFoodKindId) => {
    const conn = await pool.getConnection();
    try{
        await pool.query(
                `INSERT INTO member_food_kind (food_kind_id, member_id) VALUES (?, ?);`,
                [favoriteFoodKindId, memberId]
        );
        return;
    } catch(err){
        throw new Error(`
            🚫 오류 발생 🚫 
            요청 파라미터 확인 바람 (${err})
        `);
    } finally{
        conn.release();
    }
};

// 회원 - 선호_음식_종류 반환
export const getMemberFavoriteFoodKindByMemberId = async (memberId) => {
    const conn = await pool.getConnection();
    try{
        const [favoriteFoodKinds] = await pool.query(`
            SELECT mfk.id, mfk.food_kind_id, mfk.member_id, fk.kind
            FROM member_food_kind mfk JOIN food_kind fk ON mfk.food_kind_id = fk.id
            WHERE mfk.member_id = ?
            ORDER BY mfk.food_kind_id ASC`,
            memberId
        );
        return favoriteFoodKinds;
    }catch(err){
        throw new Error(`
            🚫 오류 발생 🚫 
            요청 파라미터 확인 바람 (${err})
        `);
    }finally{
        conn.release();
    }
}