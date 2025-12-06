import json
import os
import psycopg2
import hashlib
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Обработка платежей через ЮMoney
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    query_params = event.get('queryStringParameters') or {}
    action = query_params.get('action', '')
    
    if action == 'create':
        return create_payment(event)
    elif action == 'callback':
        return handle_callback(event)
    
    return {
        'statusCode': 404,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Not found. Use ?action=create or ?action=callback'}),
        'isBase64Encoded': False
    }

def create_payment(event: Dict[str, Any]) -> Dict[str, Any]:
    try:
        body_str = event.get('body') or '{}'
        body = json.loads(body_str) if body_str else {}
    except json.JSONDecodeError:
        body = {}
    
    user_id = body.get('user_id')
    product_id = body.get('product_id')
    product_name = body.get('product_name')
    price = body.get('price')
    
    if not all([user_id, product_id, product_name, price]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing required fields'}),
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO purchases (user_id, product_id, product_name, price, status) VALUES (%s, %s, %s, %s, %s) RETURNING id",
        (user_id, product_id, product_name, price, 'pending')
    )
    purchase_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    
    shop_id = os.environ.get('YOOMONEY_SHOP_ID', '')
    
    payment_url = f"https://yoomoney.ru/quickpay/confirm.xml?receiver={shop_id}&quickpay-form=shop&targets={product_name}&paymentType=SB&sum={price}&label={purchase_id}"
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'payment_url': payment_url,
            'purchase_id': purchase_id
        }),
        'isBase64Encoded': False
    }

def handle_callback(event: Dict[str, Any]) -> Dict[str, Any]:
    body = json.loads(event.get('body', '{}'))
    
    notification_type = body.get('notification_type')
    operation_id = body.get('operation_id')
    amount = body.get('amount')
    label = body.get('label')
    sha1_hash = body.get('sha1_hash')
    
    if notification_type != 'p2p-incoming':
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid notification type'}),
            'isBase64Encoded': False
        }
    
    secret = os.environ.get('YOOMONEY_SECRET_KEY', '')
    check_string = f"{notification_type}&{operation_id}&{amount}&643&{label}&{secret}"
    expected_hash = hashlib.sha1(check_string.encode()).hexdigest()
    
    if sha1_hash != expected_hash:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid signature'}),
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    cur.execute(
        "UPDATE purchases SET status = %s, payment_id = %s WHERE id = %s",
        ('completed', operation_id, int(label))
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