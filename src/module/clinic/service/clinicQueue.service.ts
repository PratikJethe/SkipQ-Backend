import { TokenStatusEnum } from "../../../constants/enums/clinic.enum";
import clinicDao from "../dao/clinic.dao";
import clinicQueueDao from "../dao/clinicQueue.dao";
import { IClinicModel } from "../interface/clinic.interface";
import { IClinicQueue, IClinicQueueModel } from "../interface/clinicQueue.interface";
import { ClinicQueueModel } from "../model/clinicQueue.model";

class ClinicQueueService {


  async requestToken(token: IClinicQueue): Promise<IClinicQueueModel> {
    const createdToken: IClinicQueueModel = await clinicQueueDao.createToken(token);
    return createdToken;
  }
  async cancelRequest(tokenId: string): Promise<IClinicQueueModel | null> {
    const updatedToken: IClinicQueueModel | null = await clinicQueueDao.updateTokenStatus(tokenId, TokenStatusEnum.CANCELLED_REQUESTED);
    return updatedToken;
  }
  async acceptRequest(tokenId: string,tokenNumber:number): Promise<IClinicQueueModel | null> {
    const createdToken: IClinicQueueModel | null = await clinicQueueDao.updateTokenStatusWithTokenNumber(tokenId, TokenStatusEnum.PENDING_TOKEN,tokenNumber);
    return createdToken;
  }
  async rejectRequest(tokenId: string): Promise<IClinicQueueModel | null> {
    const createdToken: IClinicQueueModel | null = await clinicQueueDao.updateTokenStatus(tokenId, TokenStatusEnum.REJECTED_REQUEST);
    return createdToken;
  }
  async completeToken(tokenId: string): Promise<IClinicQueueModel | null> {
    const createdToken: IClinicQueueModel | null = await clinicQueueDao.updateTokenStatus(tokenId, TokenStatusEnum.COMPLETED_TOKEN);
    return createdToken;
  }
  async rejectToken(tokenId: string): Promise<IClinicQueueModel | null> {
    const createdToken: IClinicQueueModel | null = await clinicQueueDao.updateTokenStatus(tokenId, TokenStatusEnum.REJECTED_TOKEN);
    return createdToken;
  }
  async cancelToken(tokenId: string): Promise<IClinicQueueModel | null> {
    const createdToken: IClinicQueueModel | null = await clinicQueueDao.updateTokenStatus(tokenId, TokenStatusEnum.CANCELLED_TOKEN);
    return createdToken;
  }
  async getPendingTokens(clinicId: string): Promise<IClinicQueueModel[]> {
    const fetchedTokens: IClinicQueueModel[] = await clinicQueueDao.getTokensForRequiredStatus(clinicId, TokenStatusEnum.PENDING_TOKEN);
    return fetchedTokens;
  }
  async getRequests(clinicId: string): Promise<IClinicQueueModel[]> {
    const fetchedTokens: IClinicQueueModel[] = await clinicQueueDao.getTokensForRequiredStatus(clinicId, TokenStatusEnum.REQUESTED);
    return fetchedTokens;
  }

  async getTokenForRequiredStatusByClinicId(clinicId:string,listOfStatus:TokenStatusEnum[]):Promise<IClinicQueueModel[]>{
    const tokens :IClinicQueueModel[]= await clinicQueueDao.getTokenForRequiredStatusByClinicId( clinicId,listOfStatus)
    return tokens
  }
  async getTokenForRequiredStatusByUserId(userId:string,listOfStatus:TokenStatusEnum[]):Promise<IClinicQueueModel[]>{
    const tokens :IClinicQueueModel[]= await clinicQueueDao.getTokenForRequiredStatusbyUserId( userId,listOfStatus)
    return tokens
  }


}

export const clinicQueueService = new ClinicQueueService();
