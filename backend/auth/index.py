import json
import os
import psycopg2
import jwt
from datetime import datetime, timedelta
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Авторизация пользователей через Steam и Discord
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    query_params = event.get('queryStringParameters') or {}
    action = query_params.get('action', '')
    
    if action == 'steam' or method == 'POST':
        body = json.loads(event.get('body', '{}'))
        if body.get('provider') == 'steam':
            return handle_steam_auth(event)
        elif body.get('provider') == 'discord':
            return handle_discord_auth(event)
        return handle_steam_auth(event)
    elif action == 'discord':
        return handle_discord_auth(event)
    elif action == 'verify':
        return verify_token(event)
    
    return {
        'statusCode': 404,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Not found. Use ?action=steam, ?action=discord, or ?action=verify'}),
        'isBase64Encoded': False
    }

def handle_steam_auth(event: Dict[str, Any]) -> Dict[str, Any]:
    body = json.loads(event.get('body', '{}'))
    steam_id = body.get('steam_id')
    username = body.get('username')
    avatar = body.get('avatar')
    
    if not steam_id or not username:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing steam_id or username'}),
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    cur.execute(
        "SELECT id, is_admin FROM users WHERE steam_id = %s",
        (steam_id,)
    )
    user = cur.fetchone()
    
    if user:
        user_id, is_admin = user
        cur.execute(
            "UPDATE users SET last_login = CURRENT_TIMESTAMP, username = %s, avatar_url = %s WHERE id = %s",
            (username, avatar, user_id)
        )
    else:
        cur.execute(
            "INSERT INTO users (steam_id, username, avatar_url) VALUES (%s, %s, %s) RETURNING id, is_admin",
            (steam_id, username, avatar)
        )
        user_id, is_admin = cur.fetchone()
    
    conn.commit()
    cur.close()
    conn.close()
    
    jwt_secret = os.environ.get('JWT_SECRET', 'fallback_secret')
    token = jwt.encode(
        {
            'user_id': user_id,
            'steam_id': steam_id,
            'is_admin': is_admin,
            'exp': datetime.utcnow() + timedelta(days=7)
        },
        jwt_secret,
        algorithm='HS256'
    )
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'token': token,
            'user': {
                'id': user_id,
                'username': username,
                'avatar': avatar,
                'is_admin': is_admin
            }
        }),
        'isBase64Encoded': False
    }

def handle_discord_auth(event: Dict[str, Any]) -> Dict[str, Any]:
    body = json.loads(event.get('body', '{}'))
    discord_id = body.get('discord_id')
    username = body.get('username')
    avatar = body.get('avatar')
    
    if not discord_id or not username:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing discord_id or username'}),
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    cur.execute(
        "SELECT discord_id FROM admin_users WHERE discord_id = %s",
        (discord_id,)
    )
    is_admin = cur.fetchone() is not None
    
    cur.execute(
        "SELECT id, is_admin FROM users WHERE discord_id = %s",
        (discord_id,)
    )
    user = cur.fetchone()
    
    if user:
        user_id, current_admin = user
        cur.execute(
            "UPDATE users SET last_login = CURRENT_TIMESTAMP, username = %s, avatar_url = %s, is_admin = %s WHERE id = %s",
            (username, avatar, is_admin, user_id)
        )
    else:
        cur.execute(
            "INSERT INTO users (discord_id, username, avatar_url, is_admin) VALUES (%s, %s, %s, %s) RETURNING id",
            (discord_id, username, avatar, is_admin)
        )
        user_id = cur.fetchone()[0]
    
    conn.commit()
    cur.close()
    conn.close()
    
    jwt_secret = os.environ.get('JWT_SECRET', 'fallback_secret')
    token = jwt.encode(
        {
            'user_id': user_id,
            'discord_id': discord_id,
            'is_admin': is_admin,
            'exp': datetime.utcnow() + timedelta(days=7)
        },
        jwt_secret,
        algorithm='HS256'
    )
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'token': token,
            'user': {
                'id': user_id,
                'username': username,
                'avatar': avatar,
                'is_admin': is_admin
            }
        }),
        'isBase64Encoded': False
    }

def verify_token(event: Dict[str, Any]) -> Dict[str, Any]:
    headers = event.get('headers', {})
    auth_header = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    
    if not auth_header:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'No token provided'}),
            'isBase64Encoded': False
        }
    
    jwt_secret = os.environ.get('JWT_SECRET', 'fallback_secret')
    
    try:
        payload = jwt.decode(auth_header, jwt_secret, algorithms=['HS256'])
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'valid': True, 'user': payload}),
            'isBase64Encoded': False
        }
    except jwt.ExpiredSignatureError:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Token expired'}),
            'isBase64Encoded': False
        }
    except Exception:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid token'}),
            'isBase64Encoded': False
        }