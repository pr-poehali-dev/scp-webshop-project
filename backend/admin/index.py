import json
import os
import psycopg2
import jwt
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Админ-панель для управления пользователями и покупками
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
    
    headers = event.get('headers', {})
    auth_header = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    
    if not auth_header:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'}),
            'isBase64Encoded': False
        }
    
    jwt_secret = os.environ.get('JWT_SECRET', 'fallback_secret')
    
    try:
        payload = jwt.decode(auth_header, jwt_secret, algorithms=['HS256'])
        if not payload.get('is_admin'):
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Access denied'}),
                'isBase64Encoded': False
            }
    except Exception:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid token'}),
            'isBase64Encoded': False
        }
    
    query_params = event.get('queryStringParameters') or {}
    action = query_params.get('action', '')
    
    if action == 'users':
        return get_users()
    elif action == 'purchases':
        return get_purchases()
    elif action == 'add-admin':
        return add_admin(event)
    elif action == 'stats':
        return get_stats()
    
    return {
        'statusCode': 404,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Not found. Use ?action=users, ?action=purchases, ?action=add-admin, or ?action=stats'}),
        'isBase64Encoded': False
    }

def get_users() -> Dict[str, Any]:
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    cur.execute(
        "SELECT id, steam_id, discord_id, username, is_admin, created_at, last_login FROM users ORDER BY created_at DESC LIMIT 100"
    )
    users = []
    for row in cur.fetchall():
        users.append({
            'id': row[0],
            'steam_id': row[1],
            'discord_id': row[2],
            'username': row[3],
            'is_admin': row[4],
            'created_at': row[5].isoformat() if row[5] else None,
            'last_login': row[6].isoformat() if row[6] else None
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'users': users}),
        'isBase64Encoded': False
    }

def get_purchases() -> Dict[str, Any]:
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    cur.execute(
        "SELECT p.id, p.product_name, p.price, p.status, p.created_at, u.username FROM purchases p LEFT JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC LIMIT 100"
    )
    purchases = []
    for row in cur.fetchall():
        purchases.append({
            'id': row[0],
            'product_name': row[1],
            'price': row[2],
            'status': row[3],
            'created_at': row[4].isoformat() if row[4] else None,
            'username': row[5]
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'purchases': purchases}),
        'isBase64Encoded': False
    }

def add_admin(event: Dict[str, Any]) -> Dict[str, Any]:
    body = json.loads(event.get('body', '{}'))
    discord_id = body.get('discord_id')
    
    if not discord_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing discord_id'}),
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO admin_users (discord_id) VALUES (%s) ON CONFLICT (discord_id) DO NOTHING",
        (discord_id,)
    )
    cur.execute(
        "UPDATE users SET is_admin = true WHERE discord_id = %s",
        (discord_id,)
    )
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True}),
        'isBase64Encoded': False
    }

def get_stats() -> Dict[str, Any]:
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    cur.execute("SELECT COUNT(*) FROM users")
    total_users = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM purchases WHERE status = 'completed'")
    total_purchases = cur.fetchone()[0]
    
    cur.execute("SELECT COALESCE(SUM(price), 0) FROM purchases WHERE status = 'completed'")
    total_revenue = cur.fetchone()[0]
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'total_users': total_users,
            'total_purchases': total_purchases,
            'total_revenue': total_revenue
        }),
        'isBase64Encoded': False
    }