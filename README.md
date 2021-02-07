# 计算模块 设计概览

![计算初始化](D:\Program\Project\Nodejs-Learning\calculate-module\计算初始化.png)

暂时只能做到行内数据计算，数据保存在行内。。

最多可以做到在同表中列的运算(求和、平均等等)，但运算结果也只能保存在行内。

## 现有 API

基于如下数据进行API测试：

### 测试数据

#### 表 calc_test

![image-20210203014624969](C:\Users\linxi\AppData\Roaming\Typora\typora-user-images\image-20210203014624969.png)

#### 表 calculate_info

![image-20210203013738160](C:\Users\linxi\AppData\Roaming\Typora\typora-user-images\image-20210203013738160.png)

![image-20210203014709796](C:\Users\linxi\AppData\Roaming\Typora\typora-user-images\image-20210203014709796.png)

#### 表 calculate_table

![image-20210203013820820](C:\Users\linxi\AppData\Roaming\Typora\typora-user-images\image-20210203013820820.png)

![image-20210203014540550](C:\Users\linxi\AppData\Roaming\Typora\typora-user-images\image-20210203014540550.png)

### /create

#### /calculate

##### 描述

新建计算表达式。

```json
METHOD: POST
REQUEST:
{
    "calcParser": "test_field_1 * test_field_2 + test_field_3",
    "description": "测试2"
}
RESPOND:
{
    "message": "创建计算信息成功",
    "statusCode": 200,
    "success": true,
    "data": {
        "id": 5,
        "calcParser": "test_field_1 * test_field_2 + test_field_3",
        "description": "测试2",
        "calcType": null
    }
}
```

#### /calctable

##### 描述

新建计算表。

```json
METHOD: POST
REQUEST:
{
    "calc_table": "calc_test",
    "calc_id": 5,
    "calc_priority": 98,
    "save_field": "result_2"
}
RESPOND:
{
    "message": "创建计算表成功",
    "statusCode": 200,
    "calc_stack": {
        "calc_msg": "不需要执行计算",
        "calc_info": {
            "id": 5,
            "calcParser": "test_field_1 * test_field_2 + test_field_3",
            "description": "测试2",
            "calcType": null
        }
    }
}
```

### /calculate

#### /table

##### 描述

根据表名触发计算表的计算。(根据在calculate_table里定义的优先级先后进行)

```json
METHOD: GET
REQUEST:
{
	"calc_table": "calc_test" 
}
RESPOND:
{
    "statusCode": 200,
    "message": "计算完成",
    "calc_stack": [
        {
            "calc_msg": "计算完成 共 0 个错误",
            "calc_info": {
                "id": 3,
                "calcParser": "test_field_1 + test_field_2 + test_field_3",
                "description": "测试用",
                "calcType": null
            }
        },
        {
            "calc_msg": "计算完成 共 0 个错误",
            "calc_info": {
                "id": 5,
                "calcParser": "test_field_1 * test_field_2 + test_field_3",
                "description": "测试2",
                "calcType": null
            }
        }
    ]
}
```

### /test

测试表达式、返回结果的api

#### /data

返回目标表中的所有数据

```json
METHOD: GET
REQUEST:
{
	"tablename": "calc_test" 
}
RESPOND:
{
    "statusCode": 200,
    "success": true,
    "result": [
        {
            "id": 1,
            "test_field_1": 100,
            "test_field_2": 9,
            "test_field_3": 8,
            "result": "117",
            "result_2": "908",
            "result_valid": 1,
            "result_2_valid": 0,
            "result_3": "9"
        },
        {
            "id": 2,
            "test_field_1": 200,
            "test_field_2": 11,
            "test_field_3": 18,
            "result": "229",
            "result_2": "2218",
            "result_valid": 1,
            "result_2_valid": 0,
            "result_3": "161"
        }
    ]
}
```

#### /calctable

返回符合条件的所有计算信息（calculate_table 表）

```
METHOD: GET
REQUEST:
{
	"calc_table": "calc_test"
}
RESPOND:
{
    "statusCode": 200,
    "success": true,
    "result": [
        {
            "id": 3,
            "calc_table": "calc_test",
            "calc_id": 6,
            "calc_priority": 100,
            "save_field": "result_3",
            "valid_flag": null,
            "valid_field": null,
            "calc_flag": "test_field_3 < 20"
        },
        {
            "id": 1,
            "calc_table": "calc_test",
            "calc_id": 3,
            "calc_priority": 99,
            "save_field": "result",
            "valid_flag": "100 < result",
            "valid_field": "result_valid",
            "calc_flag": null
        },
        {
            "id": 2,
            "calc_table": "calc_test",
            "calc_id": 5,
            "calc_priority": 98,
            "save_field": "result_2",
            "valid_flag": "result_2 < 0",
            "valid_field": "result_2_valid",
            "calc_flag": null
        }
    ]
}
```

#### /calc_info

返回符合条件的计算表达式(calculate_info)

```json
METHOD: GET
REQUEST:
{}
RESPOND:
{
    "statusCode": 200,
    "success": true,
    "result": [
        {
            "id": 3,
            "calcParser": "test_field_1 + test_field_2 + test_field_3",
            "description": "测试用",
            "calcType": null
        },
        {
            "id": 4,
            "calcParser": "1+1",
            "description": null,
            "calcType": null
        },
        {
            "id": 5,
            "calcParser": "test_field_1 * test_field_2 + test_field_3",
            "description": "测试2",
            "calcType": null
        },
        {
            "id": 6,
            "calcParser": "average(column('test_field_1','test_field_1 > 100')) + test_field_2 + sum(column('test_field_3', 'test_field_3 > 20'))",
            "description": null,
            "calcType": 1
        }
    ]
}
```

#### /test_parse

测试列计算（只支持列计算）,不会保存结果

```json
METHOD: POST
REQUEST:
{
    "calc_table": "calc_test",
    "parse": "average(column('test_field_1'))"
}
RESPOND:
{
    "statusCode": 200,
    "success": true,
    "result": {
        "error": null,
        "result": 150
    }
}
```



## 可能需要的 API

### /select/calculate

筛选某个表已有的所有计算表达式

或者是筛选所有计算表达式？

**是否需要对表达式进行分门别类，供用户筛选？**

### /calculate/table&calc_id

可能需要跳过优先级直接触发特定计算？

...