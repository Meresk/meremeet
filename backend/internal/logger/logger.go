package logger

import (
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"time"
)

type Logger struct {
	logger *log.Logger
	file   *os.File
}

func NewLogger(logDir string) (*Logger, error) {
	// Директория для логов
	if err := os.MkdirAll(logDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create log directory: %w", err)
	}

	// Название файла логов
	logFileName := fmt.Sprintf("app-%s.log", time.Now().Format("2006-01-02"))
	logFilePath := filepath.Join(logDir, logFileName)

	// Файл для записи
	file, err := os.OpenFile(logFilePath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		return nil, fmt.Errorf("failed to open log file: %w", err)
	}

	multiWriter := io.MultiWriter(os.Stdout, file)

	return &Logger{
		logger: log.New(multiWriter, "", log.Ldate|log.Ltime|log.Lshortfile),
		file:   file,
	}, nil
}

func (l *Logger) Close() error {
	if l.file != nil {
		return l.file.Close()
	}
	return nil
}

// PritnF записывает в консоль и в файл
func (l *Logger) PrintF(format string, v ...any) {
	l.logger.Output(2, fmt.Sprintf(format, v...))
}

// Info для информационных сообщений
func (l *Logger) Info(component, message string, args ...any) {
	fullMsg := fmt.Sprintf("[INFO][%s] %s", component, message)
	l.logger.Output(2, fmt.Sprintf(fullMsg, args...))
}

// Error для сообщений об ошибках
func (l *Logger) Error(component, message string, args ...interface{}) {
	fullMessage := fmt.Sprintf("[ERROR][%s] %s", component, message)
	l.logger.Output(2, fmt.Sprintf(fullMessage, args...))
}

// Request для связанного с конкретным запросом
func (l *Logger) Request(requestID, component, message string, args ...interface{}) {
	fullMessage := fmt.Sprintf("[%s][%s] %s", requestID, component, message)
	l.logger.Output(2, fmt.Sprintf(fullMessage, args...))
}

// RequestWithMeta для связанного с конкретным запросом с дополнительными метаданными
func (l *Logger) RequestWithMeta(requestID, component, ip, userAgent, message string, args ...interface{}) {
	meta := fmt.Sprintf("IP:%s UA:%s", ip, userAgent)
	fullMessage := fmt.Sprintf("[%s][%s][%s] %s", requestID, component, meta, message)
	l.logger.Output(2, fmt.Sprintf(fullMessage, args...))
}
