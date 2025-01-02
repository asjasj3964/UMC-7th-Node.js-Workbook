import { prisma } from "../db.config.ts";
import { ServerError } from "../errors.ts";

export const getRegion = async(regionId: bigint) => {
    try{
        const region = await prisma.region.findFirst({ 
            where: {id: regionId}
        });
        // 해당 위치가 존재하지 않을 경우
        if (region == null){
            return null;
        }
        return region;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err}`);
    }
}