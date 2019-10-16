import React, {Component} from 'react';
import {Modal} from "antd";
import {Upload, Button, Icon, message} from 'antd';

const {Dragger} = Upload;


class UploadFiles extends Component {

    state = {
        fileList: [],
        stringFile: [],
        uploading: false,
        uploadSize: 0,
        visible: true,
        uploadError: false,
        uploadReady: 1,
        uploaded: false
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.visible === true && this.state.visible === false) {
            setTimeout(() => {
                this.props.history.push('/home')
            }, 100);
        }
        if (prevState.uploadReady !== 0 && this.state.uploadReady === 0 && this.state.visible === true) {
            this.exitFiles();
        }
    }

    exitFiles = () => {
        this.props.send(this.state.stringFile.join('$$'), 'file');
        this.setState({uploaded: true});
    };

    handleModalClose = () => {
        this.setState({visible: false});
    };

    handleModalOk = () => {
        this.setState({visible: false});
    };


    handleUpload = async () => {
        let files = [];
        const {fileList} = this.state;

        fileList.forEach((file) => {

            let reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = (e) => {
                files.push(e.target.result);
                this.state.stringFile.push(file.name + ';' + e.target.result);
            };

            reader.onloadstart = () => {
                this.setState({uploadReady: this.state.uploadReady + 1})
            };

            reader.onloadend = () => {
                this.setState({uploadReady: this.state.uploadReady - 1})
            };
            this.setState({uploadReady: this.state.uploadReady - 1});
        });

        this.setState({
            uploading: true,
        });

        this.setState({uploading: false});
    };


    render() {
        const {uploading, fileList} = this.state;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                        uploadSize: (this.state.uploadSize - file.size)
                    };
                });
            },
            beforeUpload: file => {
                if (file.size > 5 * 1000 * 1000) {
                    message.error("There's an 5MB file size limit!!!");
                } else {
                    this.setState(state => (
                        {
                        fileList: [...state.fileList, file], uploadSize: (state.uploadSize + file.size)
                    }));
                }
                return false;
            },
            fileList,
        };
        return (
            <Modal title="Upload files"
                   visible={this.state.visible}
                   onCancel={this.handleModalClose}
                   footer={[]}
            >
                {!this.state.uploaded ?
                    <div style={{width: '100%'}}>
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox"/>
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        </Dragger>
                        <Button
                            type="primary"
                            onClick={this.handleUpload}
                            disabled={fileList.length === 0}
                            loading={uploading}
                            style={{marginTop: 16}}
                        >
                            {uploading ? 'Uploading' : 'Start Upload'}
                        </Button>
                    </div> : <div style={{fontSize: '120%', color: '#05ff53'}}>
                        The upload was successful!!!
                    </div>}
            </Modal>
        )
    }
}


export default UploadFiles;