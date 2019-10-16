<?php 
namespace app\controllers; 

use yii\rest\ActiveController; 

class DemoController extends ActiveController 
{ 
   public $modelClass = 'app\models\Computer'; 
}