## Health 

async fn health() -> impl Responder {
    HttpResponse::Ok().body("ok")
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/health").route(web::get().to(health)))
        .service(
            web::resource("/health/auth")
                .wrap(AuthMiddleware)
                .route(web::get().to(health_auth)),
        );
}

async fn health_auth(req: actix_web::HttpRequest) -> impl Responder {
    // 미들웨어가 인증 실패시 이미 401 반환하므로 여기 도달했다면 인증 성공
    // 그래도 참고로 account_id를 응답에 포함할 수 있음
    let sub = req.extensions().get::<usize>().copied();
    HttpResponse::Ok().json(serde_json::json!({
        "ok": true,
        "sub": sub,
    }))
}


## Channel


pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/channel")
            .wrap(AuthMiddleware)
            .service(web::resource("/create").route(web::post().to(create_channel)))
            .service(web::resource("/list/{account_id}").route(web::get().to(list_my_channels)))
            .service(web::resource("/update/{id}").route(web::put().to(update_channel))),
    );
}

async fn create_channel(
    db: web::Data<DatabaseConnection>,
    payload: web::Json<channel::CreateChannelInput>,
) -> impl Responder {
    let active: channel::ActiveModel = payload.into_inner().into();

    match ChannelMutation::create_channel(&db, active).await {
        Ok(active) => match active.try_into_model() {
            Ok(model) => HttpResponse::Ok().json(model),
            Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
        },
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

async fn list_my_channels(
    db: web::Data<DatabaseConnection>,
    path: web::Path<String>,
) -> impl Responder {
    let account_id = path.into_inner();

    match ChannelQuery::find_by_account_id(&db, account_id.parse::<i64>().unwrap()).await {
        Ok(Some(list)) => HttpResponse::Ok().json(list),
        Ok(None) => HttpResponse::Ok().json(serde_json::json!([])),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

async fn update_channel(
    db: web::Data<DatabaseConnection>,
    path: web::Path<String>,
    payload: web::Json<channel::UpdateChannelInput>,
) -> impl Responder {
    let id = path.into_inner();
    match ChannelMutation::update_channel(&db, id, payload.into_inner()).await {
        Ok(active) => match active.try_into_model() {
            Ok(model) => HttpResponse::Ok().json(model),
            Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
        },
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}


#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct CreateChannelInput {
    pub account_id: i64,
    pub name: Option<String>,
    pub channel_img_url: Option<String>,
    pub script: Option<String>,
    pub ai_model: Option<String>,
}

impl From<CreateChannelInput> for ActiveModel {
    fn from(value: CreateChannelInput) -> Self {
        let id = format!("c-{}", Uuid::new_v4().to_string());

        ActiveModel {
            id: Set(id),
            name: Set(value.name),
            channel_img_url: Set(value.channel_img_url),
            account_id: Set(value.account_id),
            script: Set(value.script),
            ai_model: Set(value.ai_model),
            created_at: NotSet,
            updated_at: NotSet,
            deleted_at: NotSet,
        }
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct UpdateChannelInput {
    pub name: Option<String>,
    pub channel_img_url: Option<String>,
    pub script: Option<String>,
    pub ai_model: Option<String>,
}


## Message


pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/message")
            .wrap(AuthMiddleware)
            .service(web::resource("/create").route(web::post().to(create_message)))
            .service(web::resource("/list/{channel_id}").route(web::get().to(list_messages))),
    );
}

async fn create_message(
    db: web::Data<DatabaseConnection>,
    payload: web::Json<message::CreateMessageInput>,
) -> impl Responder {
    let active: message::ActiveModel = payload.into_inner().into();
    match MessageMutation::create_message(&db, active).await {
        Ok(active) => match active.try_into_model() {
            Ok(model) => HttpResponse::Ok().json(model),
            Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
        },
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

async fn list_messages(
    db: web::Data<DatabaseConnection>,
    path: web::Path<String>,
) -> impl Responder {
    let channel_id = path.into_inner();
    match MessageQuery::list_by_channel(&db, channel_id.as_str()).await {
        Ok(items) => HttpResponse::Ok().json(items),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}


#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum, Serialize, Deserialize)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::N(16))")]
pub enum ChatRole {
    #[sea_orm(string_value = "user")]
    User,
    #[sea_orm(string_value = "assistant")]
    Assistant,
    #[sea_orm(string_value = "system")]
    System,
}

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel, Deserialize, Serialize)]
#[sea_orm(table_name = "message")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: String,
    // (FK)
    pub channel_id: String,
    pub role: ChatRole,
    #[sea_orm(column_type = "Text")]
    pub content: String,
    // 어떤 ai 모델을 사용했는지 e.g: gpt-5
    pub ai_model: Option<String>,
    pub created_at: DateTime,
    pub updated_at: Option<DateTime>,
    pub deleted_at: Option<DateTime>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::channel::Entity",
        from = "Column::ChannelId",
        to = "super::channel::Column::Id"
    )]
    Channel,
}

impl ActiveModelBehavior for ActiveModel {}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct CreateMessageInput {
    pub channel_id: String,
    pub role: ChatRole,
    pub content: String,
    pub ai_model: Option<String>,
}

impl From<CreateMessageInput> for ActiveModel {
    fn from(value: CreateMessageInput) -> Self {
        let id = format!("m-{}", Uuid::new_v4().to_string());

        ActiveModel {
            id: Set(id),
            created_at: NotSet,
            updated_at: NotSet,
            deleted_at: NotSet,
            channel_id: Set(value.channel_id),
            role: Set(value.role),
            content: Set(value.content),
            ai_model: Set(value.ai_model),
        }
    }
}

## Auth


pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/auth/create").route(web::post().to(register)))
        .service(web::resource("/auth/login").route(web::post().to(login_with_email)))
        .service(
            web::resource("/auth/update")
                .wrap(AuthMiddleware)
                .route(web::put().to(update_user)),
        );
}

async fn register(
    db: web::Data<DatabaseConnection>,
    payload: web::Json<user::CreateUserInput>,
) -> impl Responder {
    let active: user::ActiveModel = payload.into_inner().into();
    match UserMutation::create_user(&db, active).await {
        Ok(active) => match active.try_into_model() {
            Ok(model) => HttpResponse::Ok().json(model),
            Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
        },
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    email: String,
}

#[derive(Debug, Serialize)]
pub struct TokenResponse {
    token: String,
}

async fn login_with_email(
    db: web::Data<DatabaseConnection>,
    payload: web::Json<LoginRequest>,
) -> impl Responder {
    match UserQuery::find_by_email(&db, &payload.email).await {
        Ok(user) => match auth::create_jwt(user.id.try_into().unwrap()) {
            Ok(token) => HttpResponse::Ok().json(serde_json::json!({"token": token})),
            Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
        },
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

async fn update_user(
    db: web::Data<DatabaseConnection>,
    req: actix_web::HttpRequest,
    payload: web::Json<user::UpdateUserInput>,
) -> impl Responder {
    // 미들웨어에서 저장한 account_id 추출 (usize)
    let account_id = match req.extensions().get::<usize>() {
        Some(id) => *id as i64,
        None => return HttpResponse::Unauthorized().finish(),
    };

    match UserMutation::update_user(&db, account_id, payload.into_inner()).await {
        Ok(active) => match active.try_into_model() {
            Ok(model) => HttpResponse::Ok().json(model),
            Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
        },
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}


#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct CreateUserInput {
    pub name: Option<String>,
    pub email: String,
    pub profile_img_url: Option<String>,
}

impl From<CreateUserInput> for ActiveModel {
    fn from(value: CreateUserInput) -> Self {
        ActiveModel {
            id: NotSet,
            identification: NotSet,
            password: NotSet,
            name: Set(value.name),
            email: Set(value.email),
            profile_img_url: Set(value.profile_img_url),
            created_at: NotSet,
            updated_at: NotSet,
            deleted_at: NotSet,
        }
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct UpdateUserInput {
    pub name: Option<String>,
    pub profile_img_url: Option<String>,
}


## Bookmark


#[derive(serde::Deserialize)]
struct BookmarkQuery {
    channel_id: Option<String>,
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/bookmark")
            .wrap(AuthMiddleware)
            .service(web::resource("/create").route(web::post().to(create_bookmark)))
            .service(web::resource("/list").route(web::get().to(list_bookmarked_messages)))
            .service(web::resource("/delete").route(web::delete().to(delete_bookmark))),
    );
}

#[derive(serde::Deserialize)]
pub struct CreateBookmarkBody {
    message_id: String,
}

#[derive(serde::Serialize)]
pub struct BookmarkStatus {
    bookmark: bool,
}

async fn create_bookmark(
    db: web::Data<DatabaseConnection>,
    req: HttpRequest,
    body: web::Json<CreateBookmarkBody>,
) -> impl Responder {
    let account_id: i64 = match req.extensions().get::<usize>() {
        Some(id) => *id as i64,
        None => return HttpResponse::Unauthorized().finish(),
    };

    let message_id = body.message_id.clone();

    // check if message_id is in the database
    let maybe_message = match message::Entity::find()
        .filter(message::Column::Id.eq(message_id.clone()))
        .one(db.get_ref())
        .await
    {
        Ok(v) => v,
        Err(e) => return HttpResponse::InternalServerError().body(e.to_string()),
    };
    if maybe_message.is_none() {
        return HttpResponse::NotFound().body("Message not found");
    }

    // check if bookmark_message is already in the database
    let bookmark_message = match bookmark_message::Entity::find()
        .filter(bookmark_message::Column::MessageId.eq(message_id.clone()))
        .filter(bookmark_message::Column::AccountId.eq(account_id))
        .one(db.get_ref())
        .await
    {
        Ok(v) => v,
        Err(e) => return HttpResponse::InternalServerError().body(e.to_string()),
    };

    if bookmark_message.is_some() {
        return HttpResponse::Ok().json(serde_json::json!({ "bookmark": true }));
    }

    match BookmarkMessageMutation::create_bookmark_message(db.get_ref(), message_id, account_id)
        .await
    {
        Ok(_) => HttpResponse::Ok().json(serde_json::json!({ "bookmark": true })),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

async fn list_bookmarked_messages(
    db: web::Data<DatabaseConnection>,
    req: HttpRequest,
    query: web::Query<BookmarkQuery>,
) -> impl Responder {
    // 1) account_id 결정: 쿠키 우선, 없으면 미들웨어 extensions
    let account_id: i64 = match req.extensions().get::<usize>() {
        Some(id) => *id as i64,
        None => return HttpResponse::Unauthorized().finish(),
    };

    // 없다면 빈 배열
    let target_channel_ids: Vec<String> = match query.channel_id.clone() {
        Some(ch) => vec![ch.clone()],
        None => vec![],
    };

    if target_channel_ids.len() > 3 {
        return HttpResponse::BadRequest().body("channel_id must be less than 3");
    }

    // 2) 유저의 모든 북마크 레코드 조회
    let bookmarks = match bookmark_message::Entity::find()
        .filter(bookmark_message::Column::AccountId.eq(account_id))
        .filter(bookmark_message::Column::DeletedAt.is_null())
        .all(db.get_ref())
        .await
    {
        Ok(v) => v,
        Err(e) => return HttpResponse::InternalServerError().body(e.to_string()),
    };

    if bookmarks.is_empty() {
        return HttpResponse::Ok().json(serde_json::json!([]));
    }

    if target_channel_ids.is_empty() {
        return HttpResponse::Ok().json(bookmarks);
    }

    let bookmark_message_ids: Vec<String> = bookmarks.into_iter().map(|b| b.message_id).collect();

    // 3) 메시지 조회 (채널 필터가 있으면 적용)
    let query_builder = message::Entity::find()
        .filter(message::Column::Id.is_in(bookmark_message_ids))
        .filter(message::Column::DeletedAt.is_null())
        .filter(message::Column::ChannelId.is_in(target_channel_ids))
        .order_by_asc(message::Column::CreatedAt);

    match query_builder.all(db.get_ref()).await {
        Ok(items) => HttpResponse::Ok().json(items),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

async fn delete_bookmark(
    db: web::Data<DatabaseConnection>,
    req: HttpRequest,
    body: web::Json<CreateBookmarkBody>,
) -> impl Responder {
    let bookmark_message_id: String = body.message_id.clone();

    // account_id 있는지 체크
    let account_id: i64 = match req.extensions().get::<usize>() {
        Some(id) => *id as i64,
        None => return HttpResponse::Unauthorized().finish(),
    };

    // 2) 북마크가 있는지 조회
    let bookmark_message = match bookmark_message::Entity::find()
        .filter(bookmark_message::Column::Id.eq(&bookmark_message_id))
        .filter(bookmark_message::Column::AccountId.eq(account_id))
        .one(db.get_ref())
        .await
    {
        Ok(v) => v,
        Err(e) => return HttpResponse::InternalServerError().body(e.to_string()),
    };

    // 북마크가 없는데 요청보낸거면 500 에러
    if bookmark_message.is_none() {
        return HttpResponse::InternalServerError().body("bookmark message not found");
    }

    match BookmarkMessageMutation::delete_bookmark_message(db.get_ref(), bookmark_message_id).await
    {
        Ok(_) => HttpResponse::Ok().json(serde_json::json!({ "bookmark": false })),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}
