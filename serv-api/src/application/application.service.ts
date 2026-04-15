import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { BitrixFieldsDto } from './dto/submit-application.dto';

@Injectable()
export class ApplicationService {
  async sendToBitrix(fields: BitrixFieldsDto) {
    const bitrixUrl = process.env.BITRIX_WEBHOOK_URL;
    if (!bitrixUrl) {
      throw new InternalServerErrorException('Bitrix webhook not configured');
    }

    try {
      const params: Record<string, any> = {
        'FIELDS[ASSIGNED_BY_ID]': 7,
      };

      if (fields.title)           params['FIELDS[TITLE]']                 = fields.title;
      if (fields.name)            params['FIELDS[NAME]']                  = fields.name;
      if (fields.uf_crm_tarif)    params['FIELDS[UF_CRM_TARIF]']          = fields.uf_crm_tarif;
      if (fields.uf_crm_city)     params['FIELDS[UF_CRM_CITY]']           = fields.uf_crm_city;
      if (fields.phone)           params['FIELDS[PHONE][0][VALUE]']       = fields.phone;
      if (fields.uf_crm_business) params['FIELDS[UF_CRM_BUSINESS]']       = fields.uf_crm_business;
      if (fields.company_title)   params['FIELDS[COMPANY_TITLE]']         = fields.company_title;
      if (fields.comment)         params['FIELDS[COMMENTS]']              = fields.comment;
      if (fields.description)     params['FIELDS[SOURCE_DESCRIPTION]']    = fields.description;
      if (fields.abonent_status)  params['FIELDS[UF_CRM_ABONENT_STATUS]'] = fields.abonent_status;
      if (fields.uf_crm_reklama)  params['FIELDS[UF_CRM_REKLAMA]']        = fields.uf_crm_reklama;
      if (fields.universal)       params['FIELDS[UF_CRM_1670414006263]']  = fields.universal;
      if (fields.adress)          params['FIELDS[ADDRESS]']               = fields.adress;

      const { data } = await axios.get(bitrixUrl, { params });
      return { status: 'ok', message: data };
    } catch {
      throw new InternalServerErrorException('Failed to submit application');
    }
  }
}
