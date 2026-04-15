# API Documentation

Base URL: `http://localhost:3000`

---

## Authentication

Most write endpoints require a JWT token.

### Login

```
POST /auth/login
```

Rate limited: **5 requests / 60s per IP**

**Body**
```json
{
  "email": "admin@example.com",
  "password": "your_password"
}
```

**Response**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Use the token in all protected requests:
```
Authorization: Bearer <access_token>
```

---

## Banners

### Get public banners
```
GET /banners
```
Returns only visible banners.

### Get all banners (admin)
```
GET /banners/all
Authorization: Bearer <token>
```

### Create banner
```
POST /banners
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title_uz | string | yes | Title in Uzbek |
| title_ru | string | yes | Title in Russian |
| subtitle_uz | string | yes | Subtitle in Uzbek |
| subtitle_ru | string | yes | Subtitle in Russian |
| btn_uz | string | yes | Button text in Uzbek |
| btn_ru | string | yes | Button text in Russian |
| btn_link | string | yes | Button URL |
| position | number | no | Display order |
| image | file | yes | Banner image |

### Update banner
```
PATCH /banners/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
All fields optional. Same fields as create.

### Toggle visibility
```
PATCH /banners/:id/visibility
Authorization: Bearer <token>
```

### Reorder banners
```
PATCH /banners/reorder
Authorization: Bearer <token>
```
```json
{ "ids": ["id1", "id2", "id3"] }
```

### Delete banner
```
DELETE /banners/:id
Authorization: Bearer <token>
```

---

## Advantages

### Get public advantages
```
GET /advantages
```

### Get all advantages (admin)
```
GET /advantages/all
Authorization: Bearer <token>
```

### Create advantage
```
POST /advantages
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

| Field | Type | Required |
|-------|------|----------|
| title_uz | string | yes |
| title_ru | string | yes |
| subtitle_uz | string | yes |
| subtitle_ru | string | yes |
| position | number | no |
| image | file | yes |

### Update advantage
```
PATCH /advantages/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
All fields optional.

### Toggle visibility
```
PATCH /advantages/:id/visibility
Authorization: Bearer <token>
```

### Reorder advantages
```
PATCH /advantages/reorder
Authorization: Bearer <token>
```
```json
{ "ids": ["id1", "id2", "id3"] }
```

### Delete advantage
```
DELETE /advantages/:id
Authorization: Bearer <token>
```

---

## Services

### Get public services
```
GET /services
```

### Get all services (admin)
```
GET /services/all
Authorization: Bearer <token>
```

### Get service by ID
```
GET /services/:id
Authorization: Bearer <token>
```

### Create service
```
POST /services
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

| Field | Type | Required |
|-------|------|----------|
| title_uz | string | yes |
| title_ru | string | yes |
| descr_uz | string | yes |
| descr_ru | string | yes |
| btn_name_uz | string | yes |
| btn_name_ru | string | yes |
| btn_link | string | yes |
| freebtn_uz | string | yes |
| freebtn_ru | string | yes |
| more_link | string | yes |
| morename_uz | string | yes |
| morename_ru | string | yes |
| is_visible | boolean | no |
| image | file | yes |

### Update service
```
PATCH /services/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
All fields optional.

### Toggle visibility
```
PATCH /services/:id/visibility
Authorization: Bearer <token>
```

### Reorder services
```
PATCH /services/reorder
Authorization: Bearer <token>
```
```json
{ "ids": ["id1", "id2", "id3"] }
```

### Delete service
```
DELETE /services/:id
Authorization: Bearer <token>
```

---

## Equipments

### Get public equipments
```
GET /equipments
```

### Get all equipments (admin)
```
GET /equipments/all
Authorization: Bearer <token>
```

### Get equipment by ID
```
GET /equipments/:id
Authorization: Bearer <token>
```
Returns equipment with its `main_chars` array.

### Create equipment
```
POST /equipments
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

| Field | Type | Required |
|-------|------|----------|
| title_uz | string | yes |
| title_ru | string | yes |
| more_btn_uz | string | yes |
| more_btn_ru | string | yes |
| info_uz | string | yes |
| info_ru | string | yes |
| description_uz | string | no |
| description_ru | string | no |
| seo_uz | string | no |
| seo_ru | string | no |
| is_visible | boolean | no |
| img | file | yes |

### Update equipment
```
PATCH /equipments/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
All fields optional.

### Toggle visibility
```
PATCH /equipments/:id/visibility
Authorization: Bearer <token>
```

### Delete equipment
```
DELETE /equipments/:id
Authorization: Bearer <token>
```

### Add main characteristic
```
POST /equipments/:id/chars
Authorization: Bearer <token>
```
```json
{
  "name_uz": "Tezlik",
  "name_ru": "Скорость"
}
```

### Update main characteristic
```
PATCH /equipments/chars/:charId
Authorization: Bearer <token>
```
```json
{
  "name_uz": "Tezlik",
  "name_ru": "Скорость"
}
```

### Delete main characteristic
```
DELETE /equipments/chars/:charId
Authorization: Bearer <token>
```

---

## Partners

### Get public partners
```
GET /partners
```

### Get all partners (admin)
```
GET /partners/all
Authorization: Bearer <token>
```

### Get partner by ID
```
GET /partners/:id
Authorization: Bearer <token>
```
Returns partner with its `conditions` array.

### Create partner
```
POST /partners
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title_uz | string | yes | |
| title_ru | string | yes | |
| type | string | yes | `joy`, `beauty`, `other`, `education`, `style`, `food` |
| contact_location_ru | string | no | |
| contact_location_uz | string | no | |
| contact_phone | string | no | |
| contact_site | string | no | |
| facebook | string | no | |
| instagram | string | no | |
| telegram | string | no | |
| grafik | string | no | Working hours |
| order | number | no | Display order |
| info_ru | string | no | |
| info_uz | string | no | |
| cordinates | string | no | Map coordinates |
| promo_count | number | no | |
| promo_info_ru | string | no | |
| promo_info_uz | string | no | |
| is_visible | boolean | no | |
| logo | file | no | Partner logo (1 file) |
| partner_card | file | no | Partner card image (1 file) |
| images | file[] | no | Gallery images (up to 20) |

### Update partner
```
PATCH /partners/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
All fields optional.

### Toggle visibility
```
PATCH /partners/:id/visibility
Authorization: Bearer <token>
```

### Reorder partners
```
PATCH /partners/reorder
Authorization: Bearer <token>
```
```json
{ "ids": ["id1", "id2", "id3"] }
```

### Delete partner
```
DELETE /partners/:id
Authorization: Bearer <token>
```

### Add partner condition
```
POST /partners/:id/conditions
Authorization: Bearer <token>
```
```json
{
  "name_ru": "Скидка 10%",
  "name_uz": "10% chegirma"
}
```

### Update partner condition
```
PATCH /partners/conditions/:conditionId
Authorization: Bearer <token>
```
```json
{
  "name_ru": "Скидка 15%"
}
```

### Delete partner condition
```
DELETE /partners/conditions/:conditionId
Authorization: Bearer <token>
```

---

## Vacancies

### Get public vacancies
```
GET /vacancies
```

### Get all vacancies (admin)
```
GET /vacancies/all
Authorization: Bearer <token>
```

### Get vacancy by ID
```
GET /vacancies/:id
Authorization: Bearer <token>
```
Returns vacancy with `conditions` and `requirements` arrays.

### Create vacancy
```
POST /vacancies
Authorization: Bearer <token>
Content-Type: application/json
```

| Field | Type | Required |
|-------|------|----------|
| title_uz | string | yes |
| title_ru | string | yes |
| city | string | yes |
| contact_phone | string | yes |
| contact_name_ru | string | no |
| contact_name_uz | string | no |
| subtitle_ru | string | no |
| subtitle_uz | string | no |
| garant_ru | string | no |
| garant_uz | string | no |
| res_ru | string | no |
| res_uz | string | no |
| is_visible | boolean | no |

### Update vacancy
```
PATCH /vacancies/:id
Authorization: Bearer <token>
Content-Type: application/json
```
All fields optional.

### Toggle visibility
```
PATCH /vacancies/:id/visibility
Authorization: Bearer <token>
```

### Delete vacancy
```
DELETE /vacancies/:id
Authorization: Bearer <token>
```

### Add condition
```
POST /vacancies/:id/conditions
Authorization: Bearer <token>
```
```json
{
  "condition_name_ru": "Официальное трудоустройство",
  "condition_name_uz": "Rasmiy ish joyi"
}
```

### Update condition
```
PATCH /vacancies/conditions/:conditionId
Authorization: Bearer <token>
```

### Delete condition
```
DELETE /vacancies/conditions/:conditionId
Authorization: Bearer <token>
```

### Add requirement
```
POST /vacancies/:id/requirements
Authorization: Bearer <token>
```
```json
{
  "name_ru": "Опыт работы от 1 года",
  "name_uz": "1 yildan ortiq ish tajribasi"
}
```

### Update requirement
```
PATCH /vacancies/requirements/:requirementId
Authorization: Bearer <token>
```

### Delete requirement
```
DELETE /vacancies/requirements/:requirementId
Authorization: Bearer <token>
```

---

## Constructor

The constructor manages tariff/service plan pages. It has **sections** (groups) and **items** (individual plans).

### Get public constructor data
```
GET /constructor
```
Returns sections with their visible, non-archived items.

### Get all constructor data (admin)
```
GET /constructor/all
Authorization: Bearer <token>
```

### Create section
```
POST /constructor/sections
Authorization: Bearer <token>
```
```json
{ "name": "Internet tariffs" }
```

### Update section
```
PATCH /constructor/sections/:id
Authorization: Bearer <token>
```
```json
{ "name": "Updated name" }
```

### Delete section
```
DELETE /constructor/sections/:id
Authorization: Bearer <token>
```

### Create item in section
```
POST /constructor/sections/:sectionId/items
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title_uz | string | yes | |
| title_ru | string | yes | |
| access_only_by_url | boolean | no | Hide from listings, accessible by direct URL only |
| description_ru | string | no | Full description |
| description_uz | string | no | |
| short_text_ru | string | no | Short preview text |
| short_text_uz | string | no | |
| seo_ru | string | no | SEO meta text |
| seo_uz | string | no | |
| is_visible | boolean | no | |
| is_archived | boolean | no | |
| page | string | no | `internet`, `fiz`, `teh`, `yur`, `data`, `iptv`, `equipments`, `other`, `both` |
| cities | string[] | no | List of cities where available |
| image | file | no | Russian image |
| image_uz | file | no | Uzbek image |

### Update item
```
PATCH /constructor/items/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
All fields optional.

### Toggle item visibility
```
PATCH /constructor/items/:id/visibility
Authorization: Bearer <token>
```

### Toggle item archive
```
PATCH /constructor/items/:id/archive
Authorization: Bearer <token>
```

### Delete item
```
DELETE /constructor/items/:id
Authorization: Bearer <token>
```

---

## Applications

Submit a customer application. Sends data to Bitrix CRM.

```
POST /applications/submit
```

Rate limited: **10 requests / 60s per IP**

**Body**
```json
{
  "recaptcha": "03AGdBq...",
  "bitrix": {
    "title": "Application title",
    "name": "Customer Name",
    "phone": "+998901234567",
    "uf_crm_tarif": "Tariff name",
    "uf_crm_city": "Tashkent",
    "uf_crm_business": "business type",
    "company_title": "Company LLC",
    "comment": "Additional comment",
    "description": "Description",
    "abonent_status": "new",
    "uf_crm_reklama": "utm_source",
    "universal": "extra field",
    "adress": "Street address"
  }
}
```

All `bitrix` fields are optional. `recaptcha` is optional if `RECAPTCHA_SECRET` is not configured.

---

## Static Files

Uploaded files are served at:
```
GET /uploads/{module}/{filename}
```

Examples:
```
/uploads/banners/image.jpg
/uploads/partners/logo.png
/uploads/equipments/photo.webp
```

Supported formats: `jpg`, `jpeg`, `png`, `gif`, `webp`, `svg`
Max file size: **20 MB**

---

## Error Responses

All errors return:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "timestamp": "2026-04-15T10:00:00.000Z",
  "path": "/endpoint"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Validation error — check request body |
| 401 | Unauthorized — missing or invalid JWT token |
| 403 | Forbidden |
| 404 | Resource not found |
| 422 | reCAPTCHA validation failed |
| 429 | Too many requests — rate limit hit |
| 500 | Internal server error |
