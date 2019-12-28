# Paddle-Mobile
 
[![Build Status](https://travis-ci.org/PaddlePaddle/paddle-mobile.svg?branch=develop&longCache=true&style=flat-square)](https://travis-ci.org/PaddlePaddle/paddle-mobile)
[![Documentation Status](https://img.shields.io/badge/中文文档-最新-brightgreen.svg)](https://github.com/PaddlePaddle/paddle-mobile/tree/develop/doc)
[![License](https://img.shields.io/badge/license-Apache%202-blue.svg)](LICENSE)

<!--[![Release](https://img.shields.io/github/release/PaddlePaddle/Paddle-Mobile.svg)](https://github.com/PaddlePaddle/Paddle-Mobile/releases)
[![License](https://img.shields.io/badge/license-Apache%202-blue.svg)](LICENSE)-->


欢迎来到 Paddle-Mobile GitHub 项目。Paddle-Mobile是PaddlePaddle组织下的项目，是一个致力于嵌入式平台的深度学习的框架。

## Features

- 高性能支持ARM CPU 
- 支持Mali GPU
- 支持Andreno GPU
- 支持苹果设备的GPU Metal实现
- 支持ZU5、ZU9等FPGA开发板
- 支持树莓派等arm-linux开发板

## Demo目录
[https://github.com/PaddlePaddle/paddle-mobile/tree/develop/demo](https://github.com/PaddlePaddle/paddle-mobile/tree/develop/demo)

## 文档

### 设计文档

关于paddle-mobile设计文档在下面链接中，如果想了解更多内容。[issue](https://github.com/PaddlePaddle/paddle-mobile/issues)中会有很多早期的设计和讨论过程。
[设计文档链接](https://github.com/PaddlePaddle/paddle-mobile/blob/develop/doc/design_doc.md)

### 开发文档

开发文档主要是关于编译、运行等问题。做为开发者，它可以和贡献文档共同结合使用。
* [iOS](https://github.com/PaddlePaddle/paddle-mobile/blob/develop/doc/development_ios.md)
* [Android](https://github.com/PaddlePaddle/paddle-mobile/blob/develop/doc/development_android.md)
* [FPGA](https://github.com/PaddlePaddle/paddle-mobile/blob/develop/doc/development_fpga.md)
* [ARM_LINUX](https://github.com/PaddlePaddle/paddle-mobile/blob/develop/doc/development_arm_linux.md)

### 贡献文档
- [贡献文档链接](https://github.com/PaddlePaddle/paddle-mobile/blob/develop/CONTRIBUTING.md)
- 上面文档中涵盖了主要的贡献代码流程，如果在实践中您还遇到了其他问题，可以发[issue](https://github.com/PaddlePaddle/paddle-mobile/issues)。我们看到后会尽快处理。


## 模型获得
目前Paddle-Mobile仅支持Paddle fluid训练的模型。如果你手中的模型是不同种类的模型，需要进行模型转换才可以运行。
### 1. 直接使用Paddle Fluid训练
该方式最为可靠，推荐方式
### 2. caffe转为Paddle Fluid模型
[https://github.com/PaddlePaddle/models/tree/develop/fluid/image_classification/caffe2fluid](https://github.com/PaddlePaddle/models/tree/develop/fluid/image_classification/caffe2fluid)
### 3. ONNX
ONNX全称为“Open Neural Network Exchange”，即“开放的神经网络切换”。该项目的目的是让不同的神经网络开发框架做到互通互用。

除直接使用PaddlePaddle训练fluid版本的模型外，还可以通过onnx转换得到个别Paddle fluid模型。

目前，百度也在做onnx支持工作。相关转换项目在这里：
[https://github.com/PaddlePaddle/paddle-onnx](https://github.com/PaddlePaddle/paddle-onnx)

### 4. 部分测试模型和测试图片下载
[http://mms-graph.bj.bcebos.com/paddle-mobile%2FmodelsAndImages.zip](http://mms-graph.bj.bcebos.com/paddle-mobile%2FmodelsAndImages.zip)

<!--## 简单搜索线上效果

如下gif是简单搜索app的线上主体检测应用效果
![ezgif-1-050a733dfb](http://otkwwi4x8.bkt.clouddn.com/2018-07-05-ezgif-1-050a733dfb.gif)-->

## 问题解决

欢迎提出或解决我们的问题，有疑问可以发issue. [Github Issues](https://github.com/PaddlePaddle/paddle-mobile/issues).

## Copyright and License
Paddle-Mobile 提供相对宽松的Apache-2.0开源协议 [Apache-2.0 license](LICENSE).


## 旧版 Mobile-Deep-Learning
原MDL(Mobile-Deep-Learning)工程被迁移到了这里 [Mobile-Deep-Learning](https://github.com/allonli/mobile-deep-learning) 
