<?php
if (file_exists(__DIR__.'/config.php'))
    include(__DIR__.'/config.php');

class User {
    
     public function __construct($fio, $phone, $email, $pass, $passConfirm)
    {
        $this->fio = $fio;
        $this->phone = $phone;
        $this->email = $email;
        $this->pass = $pass;
        $this->passConfirm = $passConfirm;
        $this->validation = Array();

    }
    
    protected function hashPass() {
        $this->pass = md5($this->pass."testtask");
    }
    
    protected function emailValid() {
        if(!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            array_push($this->validation, 'email');
        }
    }
    
    protected function fioValid() {
        if (preg_match('/[^а-я ]+/msiu', $this->fio)) {
            array_push($this->validation, 'fio');
        }
    }
    
    protected function passValid() {
        if (!preg_match('/^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/', $this->pass)) {
                array_push($this->validation, 'pass');
        } else {
            if ($this->pass === $this->passConfirm) {
                $this->hashPass();
            } else {
                array_push($this->validation, 'passConfirm');

            }
        }
    }
    
    protected function phoneValid() {
        if (!preg_match('/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/', $this->phone)) {
                array_push($this->validation, 'phone');
        } 
    }
    
    public function createUser($config) {
        $this->phoneValid();
        $this->emailValid();
        $this->passValid();
        $this->fioValid();
        
        if ($this->validation) {
            $res = json_encode(Array('validError' => $this->validation), 1);
            
            echo $res;
            die();
        } else {

            $mysqli = new mysqli($config->host, $config->user, $config->password, $config->db);
            if ($mysqli->connect_error) {
                $result = Array('error' => 'error with connection db');
                
                $res = json_encode($result, 1);
                
                echo $res;
                die();
        } else {
            
            $query = "INSERT INTO `Task` (`Fio`, `tel`, `email`, `pass`) VALUES ('{$this->fio}', '{$this->phone}', '{$this->email}', '{$this->pass}')";
            
            if ($mysqli->query($query)) {
                $result = Array('access' => true);
                $res = json_encode($result, 1);
                
                echo $res;
            } else {
                $result = Array('error' => $mysqli->error);
                $res = json_encode($result, 1);
                
                echo $res;
            }
            $mysqli->close();

        }    
        }
    }
    
}

$fio = $_POST['fio'];
$phone = $_POST['phone'];
$email = $_POST['email'];
$pass = $_POST['pass'];
$passConfirm = $_POST['passConfirm'];

$_config = new Config();

$user = new User($fio, $phone, $email, $pass, $passConfirm);

$user->createUser($_config);